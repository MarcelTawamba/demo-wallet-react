import React, { Component } from 'react';
import * as yup from 'yup';

import { Formik, Form } from 'formik';

import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import ErrorOutput from 'components/outputs/Error';
import Input from 'components/inputs/Input';
import * as inputs from 'config/inputs';
import CompanyList from './CompanyList';
import PageTitle from 'components/layout/page/PageTitle';
import { standardizeString } from 'util/general';
import CompanyListItem from './CompanyListItem';
import colors from 'config/config/defaults/colors.json';

class CompanyForm extends Component {
  state = {
    formState: '',
    modalVisible: false,
  };

  handleSubmit = (company, formikProps) => {
    this.props.handleSubmit(company, formikProps);
  };

  handleStateChange = formState => {
    this.setState({ formState });
  };

  handleCompanySelect(company, formikProps) {
    formikProps.setFieldValue('company', company);
    this.handleSubmit(company, formikProps);
  }

  renderAll = formikProps => {
    const { companies } = this.props;
    return (
      <React.Fragment>
        <CompanyList
          companySearch={formikProps.values.company}
          handleStateChange={this.handleStateChange}
          formikProps={formikProps}
          companies={companies}
          handleSubmit={this.handleSubmit}
        />
      </React.Fragment>
    );
  };

  renderDetail = formikProps => {
    const { companies, onBack } = this.props;
    const { formState } = this.state;
    return (
      <React.Fragment>
        <PageTitle
          back
          titleVariant={'h6'}
          handleBack={() => this.setState({ formState: '' })}
          title={standardizeString(formState) + ' apps'}
        />

        {companies[formState + 'Companies']
          .filter(company => company.id.includes(formikProps.values.company))
          .map((company, index) => (
            <CompanyListItem
              key={company.id}
              id={company.id}
              title={company ? (company.name ? company.name : company.id) : ''}
              subtitle={
                company
                  ? company.description
                    ? company.description
                    : company.id && company.name
                    ? company.id
                    : ''
                  : ''
              }
              image={
                company.icon ? company.icon : company.logo ? company.logo : ''
              }
              onClick={() => this.handleCompanySelect(company.id, formikProps)}
            />
          ))}
      </React.Fragment>
    );
  };

  render() {
    const { error, loading } = this.props;
    const { formState } = this.state;

    const formSchema = yup.object().shape({
      company: yup.string().required('Please enter a valid App ID'),
    });

    return (
      <Formik
        initialValues={{
          company: '',
        }}
        // isInitialValid={companies.currentCompanyID}
        validationSchema={formSchema}>
        {formikProps =>
          loading ? (
            <div />
          ) : (
            <Form>
              <View fD={'row'} w={'100%'} aI={'flex-start'} pl={0.5}>
                <Input
                  // style={{ marginTop: 2 }}
                  field={{
                    ...inputs.company,
                    autoFocus: true,
                    helper: '',
                    type: 'search',
                  }}
                  formikProps={formikProps}
                />
                <div style={{ minWidth: 120, width: 120, paddingTop: 5 }}>
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.primaryContrast,
                      height: 38,
                    }}
                    variant={'contained'}
                    className="btn btn-block focus"
                    onClick={() =>
                      this.handleSubmit(formikProps.values.company)
                    }
                    wide
                    disabled={!formikProps.isValid || formikProps.isSubmitting}
                    loading={formikProps.isSubmitting}
                    id="join"
                    capitalize
                  />
                </div>
              </View>
              <ErrorOutput>{error}</ErrorOutput>
              {formState
                ? this.renderDetail(formikProps)
                : this.renderAll(formikProps)}
            </Form>
          )
        }
      </Formik>
    );
  }
}

export default CompanyForm;
