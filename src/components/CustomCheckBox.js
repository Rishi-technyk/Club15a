import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CustomCheckbox = ({ checked, onToggle }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Icon
      name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
      size={24}
      color={checked ? '#007AFF' : '#888'} // Customize colors
    />
    
  </TouchableOpacity>
);