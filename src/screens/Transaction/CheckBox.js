import React from 'react';
import { View, Text } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";


const CheckBoxe = ({setCheckedBox,index,checkedBox}) => {
    return (
        <BouncyCheckbox
            size={20}
            fillColor="#79ca14"
            unfillColor="#FFFFFF"
            iconStyle={{ borderColor: '#79ca14' }}
            isChecked={index == checkedBox?true:false}
            disableBuiltInState
        
            onChangeText={(item)=>{}}
            onPress={(isChecked) => {
                setCheckedBox(index)
                  }}
        
        />
    )
}


export default CheckBoxe;