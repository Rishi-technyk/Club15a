import Snackbar from 'react-native-snackbar';

/**
 * Will show the message in snack bar.
 */
export function displaySnackBar(message) {
    Snackbar.show({
        title: message,
        duration: Snackbar.LENGTH_LONG
    });
}
/**
 * Will dismiss all the snackbars displaying on screen.
 */
export function hideSnackBar() {
    Snackbar.dismiss();
}