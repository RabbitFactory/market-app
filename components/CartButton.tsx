import * as React from "react";
import { Button } from "@rneui/base";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default () => {
  return (
    <Button
      buttonStyle={{
        width: 140,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(39, 39, 39, 1)',
        paddingHorizontal: 10,
      }}
      containerStyle={{ margin: 5 }}
      disabledStyle={{
        borderWidth: 2,
        borderColor: "#00F"
      }}
      disabledTitleStyle={{ color: "#00F" }}
      icon={<MaterialIcons name="shopping-cart" size={20} color="white" />}
      loadingProps={{ animating: true }}
      loadingStyle={{}}
      title="Add to Cart"
      titleProps={{}}
      titleStyle={{ fontSize: 14, marginHorizontal: 5 }}
    />
  );
};
