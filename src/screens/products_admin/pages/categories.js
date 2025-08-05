import {
  getProductCategoriesAdmin,
  updateProductCategoryAdmin,
  createProductCategoryAdmin,
  deleteProductCategoryAdmin,
} from 'util/rehive';
import Inputs from '../components/inputs';
import CategoryCard from 'screens/products/components/product/CategoryCard';

async function deleteData(id) {
  try {
    // const { search } = window?.location ?? {};
    // const id = search ? 'parent=' : 'parent__isnull=true';
    const resp = await deleteProductCategoryAdmin(id);
    console.log('fetchData -> resp', resp);
    if (resp.status === 'success') {
      return true;
    }
  } catch (error) {
    return { error };
  }
}
async function fetchData() {
  try {
    const { search } = window?.location ?? {};

    const params = new URLSearchParams(search);
    let categoriesParam = params.get('categories') ?? '';
    const categories = categoriesParam.split(',');
    console.log('fetchData -> categories', categories);

    const filter = categories[categories?.length - 1]
      ? 'parent=' + categories[categories?.length - 1]
      : 'parent__isnull=true';
    console.log('fetchData -> filter', filter);
    const resp = await getProductCategoriesAdmin(filter);
    console.log('fetchData -> resp', resp);
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (error) {
    console.log('fetchData -> error', error);
    return { error };
  }
}
const defaultValues = {
  is_parent_category: false,
  category_name: '',
};

async function createData(values, control, props) {
  console.log('createData -> values', values);
  const { history, onSuccess, showToast } = props;
  const { setSubmitting, setErrors } = control;

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { secret, url, id } = values;

  const data = {
    ...values,
  };
  console.log('createData -> data', data);
  let resp = null;
  if (id) {
    resp = await updateProductCategoryAdmin(id, data);
  } else {
    resp = await createProductCategoryAdmin(data);
  }
  console.log('createData -> resp', resp);

  if (resp.status === 'success') {
    onSuccess(resp?.data?.id);
    showToast({
      id: id ? 'category_update_success' : 'category_add_success',
      variant: 'success',
    });
    history.push('/product_admin/categories/');
  } else {
    showToast({
      id: id ? 'category_update_error' : 'category_add_error',
      variant: 'error',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
  return values;
}

const formConfig = () => {
  let fields = [
    'category_name',
    'is_parent_category',
    {
      id: 'parent_category',
      condition: ({ is_parent_category }) => !is_parent_category,
    },
  ];
  return {
    title: 'Add category',
    defaultValues,
    submitLabel: 'ADD',
    onSubmit: createData,
    inputComponents: Inputs,
    fields,
  };
};

const detailConfig = {
  id: 'summary',
  title: '',
  sections: [
    {
      id: '',
      fields: [
        { label: 'campaign_name', value: 'name' },
        { label: 'campagin_description', value: 'description' },
      ],
    },
  ],
};

const exportConfigs = {
  label: 'Categories',
  value: 'categories',
  variant: 'categories',
  services: { fetchData, createData, updateData: createData, deleteData },
  components: {
    list: {
      variant: 'categories',
      headerVariant: 'categories',
      columns: [
        { label: 'Name', value: 'name' },
        // { label: 'Description', value: 'description' },
        // { label: 'Quantity', value: 'quantity', props: { align: 'right' } },
        {
          label: 'Date created',
          value: 'created',
          variant: 'date_time',
          width: 100,
        },
        {
          label: 'Date updated',
          value: 'updated',
          variant: 'date_time',
          width: 100,
        },
      ],
      // filterConfig: {
      //   type: {
      //     label: 'Available',
      //     type: 'text',
      //   },
      //   enabled: {
      //     label: 'Expired',
      //     type: 'boolean',
      //   },
      //   id: {
      //     label: 'Complete',
      //     type: 'text',
      //   },
      // },
      emptyListMessage: 'no_rewards',
      renderItem: CategoryCard,
      initialFilters: { page_size: { value: 15 } },
    },
    detail: detailConfig,
    form: formConfig,
  },
};

export default exportConfigs;
