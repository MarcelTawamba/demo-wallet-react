import React from 'react';
import Modal from 'components/layout/Modal';
import PageContent from 'components/layout/page/PageContent';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { DialogContent } from '@material-ui/core';
import IconButton from 'components/inputs/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from 'components/inputs/Button';

export const ProductsPopupModal = props => {
  const { open, onDismiss } = props;

  const src = '/images/cart.png';
  return (
    <Modal maxWidth={400} open={open} onDismiss={onDismiss}>
      <PageContent horizontal={0}>
        <View fD={'row'} jC={'flex-end'} mt={1}>
          <IconButton size={8} color={'default'} onPress={onDismiss}>
            <CloseIcon />
          </IconButton>
        </View>
        <View aI={'center'} mb={1}>
          <PopupIcon />
        </View>
        <Text
          myColor={'primary'}
          bold
          id={'products_screen_popup_title'}
          align="center"
        />
        <DialogContent>
          <Text
            id={'products_screen_popup_description'}
            style={{ fontSize: 14, marginBottom: 6 }}
          />
        </DialogContent>

        <Button wide color="primary" id="start_shopping" label="start_shopping" onPress={onDismiss} />
      </PageContent>
    </Modal>
  );
};

const PopupIcon = () => {
  return (
    <svg
      id="Component_93_1"
      data-name="Component 93 – 1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100"
      height="100"
      viewBox="0 0 100 100">
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_2887"
            data-name="Rectangle 2887"
            width="100"
            height="100"
            transform="translate(695.5 246)"
            fill="#fff"
            stroke="#707070"
            stroke-width="1"
          />
        </clipPath>
        <clipPath id="clip-path-2">
          <rect
            id="Rectangle_2888"
            data-name="Rectangle 2888"
            width="100"
            height="100"
          />
        </clipPath>
        <clipPath id="clip-path-3">
          <rect
            id="Rectangle_2889"
            data-name="Rectangle 2889"
            width="40"
            height="40"
            transform="translate(35.5 15)"
            fill="#fff"
            stroke="#707070"
            stroke-width="0.5"
          />
        </clipPath>
        <pattern
          id="pattern"
          preserveAspectRatio="xMidYMid slice"
          width="100%"
          height="100%"
          viewBox="0 0 128 128">
          <image
            width="128"
            height="128"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAC91BMVEUAAAD4lBr3lBv3kxr/qiv/v0D3lBv4kxr4kxv/mxv3lBv/lSv4lhz4kxr4lBv3lxv3lRv4kxv4lBr6lhv4lRz3lBv3lyD5lBv4kxv6kx34kxr4lBr3kxv6lBz/nSf4lBr//4D3kxr4lhv4lBr7lB34lBr7lh33lBr4kxr3kxv/nyD4kxv/lyP/lRr3lBv4lBv6lRv3lBv4lBv4lBv4kxr/lCH4lBr4lBr3lBv6lBv/niT3kxr////+/v3+/fz5uWr3lBz3kxv4p0X++vX837z71KT97975sVr3lB3+/v74qUj3mCX83bj4pUD+8+f5sVv3myz7zJP5s175tGD++/b7zZX6wn/97dn97936xIP4ojr3mCT3mSf3liL++vb4pD/5rlX82a/6wn797tv6xof84sH4qUn827L5r1b4pkT7z5r+8uT83LX969b958z++/f+9+/6wn36xIL+9u34ojv6wHr97Nj3njL6xob5s1/3lR73lR/+/fv++fL6x4n83bf95cn4p0b6vHL4pkP7zpf4pkL3min6yIv+/Pn5uWz6w4D95sr6v3n97Nf5tWL4qkz848T84sL+9uz4qkv3nC36xYX95836vnX848P6vXP++fT83rn96dL81qn4oDb96M/7zpj+9ev70qH7z5v3lSD+8+b5uGn6wXv97tz71KX96tL3lyL827P96M771ab5tmX84L/4qUr70qD3njH7z5n4q074q03++PH+8eP6xYT84L798N/++PD6u3D71af96tP70Z784cH5slz969T5t2b706P6w4H3mCb96dH5r1f5rlP5tGH4rFD84L34qEf4oTn6x4r++fP3mir3myv5sl33nS/5um73mSj70Jz3nC77y5L4pUH84cD5sFf7yo7+9Oj3nTD5um3816r95Mf7zJT95Mb+9+783rr82Kz969X4rE/98eH4oDf6x4j4rVH82K398eL7zZb5sVn+9On3liH3njP3lyP82K76vXT837v5uWv+/Pr4qEaA3nGYAAAAO3RSTlMA/uzCBgTGudocqQxJ+9JChPnMOItDIHy7NK/f7TcNiALES/M+1D3piagQlRYdhtlexayrdB91uIVfFSGgzMAAAAaaSURBVHhexdtldxvJEgbgEhriGLKG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"
          />
        </pattern>
      </defs>
      <g
        id="Mask_Group_1513"
        data-name="Mask Group 1513"
        transform="translate(-695.5 -246)"
        clip-path="url(#clip-path)">
        <g
          id="Product-currencies"
          transform="translate(695.5 246)"
          clip-path="url(#clip-path-2)">
          <g
            id="Mask_Group_1512"
            data-name="Mask Group 1512"
            transform="translate(15.86 -14.972) rotate(8)"
            clip-path="url(#clip-path-3)">
            {/* <circle
              id="bitcoin"
              cx="20"
              cy="20"
              r="20"
              transform="translate(35.5 15)"
              fill="url(#pattern)"
            /> */}
          </g>
          <g
            id="Order"
            transform="translate(0 4.5)"
            clip-path="url(#clip-path-2)">
            <path
              id="Path_62230"
              data-name="Path 62230"
              d="M581.159,1426.017H593.7l11.82,57.947h49.516"
              transform="translate(-576.5 -1408.5)"
              fill="none"
              stroke="#020d88"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="4"
            />
            <path
              id="Path_62231"
              data-name="Path 62231"
              d="M596.333,1438.531h70.878l-4.758,28.235s-.894,5.505-3.894,8.061-8.1,2.16-8.1,2.16H604.121Z"
              transform="translate(-576.5 -1408.5)"
              fill="none"
              stroke="#020d88"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="4"
            />
            <g
              id="Ellipse_1109"
              data-name="Ellipse 1109"
              transform="translate(24.5 73.5)"
              fill="none"
              stroke="#020d88"
              stroke-width="4">
              <circle cx="8.5" cy="8.5" r="8.5" stroke="none" />
              <circle cx="8.5" cy="8.5" r="6.5" fill="none" />
            </g>
            <g
              id="Ellipse_1110"
              data-name="Ellipse 1110"
              transform="translate(64 73.5)"
              fill="none"
              stroke="#020d88"
              stroke-width="4">
              <circle cx="8.5" cy="8.5" r="8.5" stroke="none" />
              <circle cx="8.5" cy="8.5" r="6.5" fill="none" />
            </g>
            <path
              id="white"
              d="M603.825,1443.523l5.044,26.871h43.366l6.388-26.871Z"
              transform="translate(-575.92 -1407.5)"
              fill="#fff"
            />
            <path
              id="primary"
              d="M603.825,1443.523l5.044,26.871h43.366l6.388-26.871Z"
              transform="translate(-575.92 -1407.5)"
              fill="#5336ff"
              opacity="0.35"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
