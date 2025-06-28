// utils/toastUtils.js

let toastRef = null;

export const setToastRef = (ref) => {
  toastRef = ref;
};

export const successToast = (message) => {
  if (toastRef) {
    toastRef.show(message, {
      type: 'success',
      data: { message },
      
      duration: 3000,
      placement: 'top',
      animationType: 'zoom-in',
    });
  } else {
    console.warn('Toast not initialized yet');
  }
};
