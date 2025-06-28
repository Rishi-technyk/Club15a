// const HomeStackNavigator = createStackNavigator(
//     {
//         Home: {
//             screen: HomeContainer,
//             navigationOptions: ({ navigation }) => ({
//                 title: 'Home',
//                 header: null
//             })
//         },

//         Profile: ProfileContainer,
//         Results: {
//             screen: ResultsContainer,
//             navigationOptions: ({ navigation }) => ({
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => { navigation.goBack() }}
//                         name="arrow-left"
//                         size={30}
//                     />)

//             })
//         },
//         // StudyMaterial: {
//         //     screen: StudyMaterialContainer,
//         //     navigationOptions: ({ navigation }) => ({
//         //         headerLeft: (
//         //             <Icon
//         //                 style={{ paddingLeft: 10 }}
//         //                 onPress={() => { navigation.goBack() }}
//         //                 name="arrow-left"
//         //                 size={30}
//         //             />)

//         //     })

//         // },
//         Notifications: {
//             screen: NotificationContainer,

//         },
//         ChangePassword: {
//             screen: ChangePassword,
//             navigationOptions: ({ navigation }) => ({
//                 headerShown: false,
//             })
//         },
//         AppointmentHistory: {
//             screen: AppointmentHistoryContainer
//         },
//         Wallet: {
//             screen: WalletContainer,
//             navigationOptions: ({ navigation }) => ({
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => { navigation.goBack() }}
//                         name="arrow-left"
//                         size={30}
//                     />)

//             })
//         },

//         TeaTime: {
//             screen: TeaTimeContainer,
//             navigationOptions: ({ navigation }) => ({
//                 headerShown: false,
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => { navigation.goBack() }}
//                         name="arrow-left"
//                         size={30}
//                     />)

//             })
//         },
//
//         TeaTimeBooking: {
//             screen: TeaTimeBookingComponent,
//             navigationOptions: ({ navigation }) => ({
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => { navigation.goBack() }}
//                         name="arrow-left"
//                         size={30}
//                     />)
//
//             })
//         },
//         // FunderList: {
//         //     screen: FunderListContainer,
//         //     navigationOptions: ({ navigation }) => ({
//         //         headerLeft: (
//         //             <Icon
//         //                 style={{ paddingLeft: 10 }}
//         //                 onPress={() => { navigation.goBack() }}
//         //                 name="arrow-left"
//         //                 size={30}
//         //             />)

//         //     })
//         // },

//         TimeTable: {
//             screen: TimeTableContainer,
//             navigationOptions: ({ navigation }) => ({
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => { navigation.goBack() }}
//                         name="arrow-left"
//                         size={30}
//                     />)

//             })

//         },
//         WebView: {
//             screen: WebViewContainer,
//             navigationOptions: ({ navigation }) => ({
//                 headerShown: false,
//                 // headerLeft: (
//                 //     <Icon
//                 //         style={{ paddingLeft: 10 }}
//                 //         onPress={() => { navigation.goBack() }}
//                 //         name="arrow-left"
//                 //         size={30}
//                 //     />)

//             })
//         },
//         PaymentSuccess: {
//             screen: PaymentSuccessComponent,
//             navigationOptions: ({ navigation }) => ({
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => { navigation.popToTop() }}
//                         name="arrow-left"
//                         size={30}
//                     />)

//             })
//         },
//         PDFView: {
//             screen: PDFContainer,
//             navigationOptions: ({ navigation }) => ({
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => { navigation.goBack() }}
//                         name="arrow-left"
//                         size={30}
//                     />)

//             })
//         },
//         Appointment: {
//             screen: AppointmentContainer,
//             navigationOptions: ({ navigation }) => ({
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => { navigation.goBack() }}
//                         name="arrow-left"
//                         size={30}
//                     />)

//             })
//         },
//         ViewStatement: {
//             screen: ViewStatementComponent,
//             navigationOptions: ({ navigation }) => ({
//                 headerShown: false
//                 // headerLeft: (
//                 //     <Icon
//                 //         style={{ paddingLeft: 10 }}
//                 //         onPress={() => { navigation.goBack() }}
//                 //         name="arrow-left"
//                 //         size={30}
//                 //     />)

//             })
//         },
//         Setting: {
//             screen: Setting,
//             navigationOptions: ({ navigation }) => ({
//                 headerShown: false
//                 // headerLeft: (
//                 //     <Icon
//                 //         style={{ paddingLeft: 10 }}
//                 //         onPress={() => { navigation.goBack() }}
//                 //         name="arrow-left"
//                 //         size={30}
//                 //     />)

//             })
//         },
//         OTP: {
//             screen: OTPComponent,
//             navigationOptions: ({ navigation }) => ({
//                 headerShown: false
//                 // headerLeft: (
//                 //     <Icon
//                 //         style={{ paddingLeft: 10 }}
//                 //         onPress={() => { navigation.goBack() }}
//                 //         name="arrow-left"
//                 //         size={30}
//                 //     />)

//             })
//         },
//         Transaction: {
//             screen: TransactionComponent,
//             navigationOptions: ({ navigation }) => ({
//                 title: 'Transaction History',
//                 headerShown: false
//                 // headerLeft: (
//                 //     <Icon
//                 //         style={{ paddingLeft: 10 }}
//                 //         onPress={() => { navigation.goBack() }}
//                 //         name="arrow-left"
//                 //         size={30}
//                 //     />)
//
//             })
//         },
//         CardRechargeComponent: {
//             screen: CardRechargeComponent,
//             navigationOptions: ({ navigation }) => ({
//                 headerShown: false
//                 // headerLeft: (
//                 //     <Icon
//                 //         style={{ paddingLeft: 10 }}
//                 //         onPress={() => { navigation.goBack() }}
//                 //         name="arrow-left"
//                 //         size={30}
//                 //     />)
//
//             })
//         }
//     },
//     {
//         defaultNavigationOptions: ({ navigation }) => {
//             return {
//                 headerLeft: (
//                     <Icon
//                         style={{ paddingLeft: 10 }}
//                         onPress={() => navigation.openDrawer()}
//                         name="menu"
//                         size={30}
//                     />
//                 )
//             };
//         }
//     }
// );

// const AppDrawerNavigator = createDrawerNavigator({

//     Home: {
//         screen: HomeStackNavigator
//     },
//     Results: {
//         screen: ResultsContainer
//     },

//     StudyMaterial: {
//         screen: StudyMaterialContainer,
//         navigationOptions: ({ navigation }) => ({
//             headerLeft: (
//                 <Icon
//                     style={{ paddingLeft: 10 }}
//                     onPress={() => { navigation.goBack() }}
//                     name="arrow-left"
//                     size={30}
//                 />)

//         })

//     },

// }, {
//     drawerPosition: 'left',
//     contentComponent: props => <AppDrawer {...props} />,
//     drawerWidth: actualDimensions.width * 0.6,
// });