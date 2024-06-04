import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import { sessioncontext } from "../contextprovider";
import { Modal, Pressable, View } from "react-native";

import { RouteProps } from "../navigation/navigation";

type routeType = NativeStackScreenProps<RouteProps, "MessageContext">;

const AttachmentModal = ({ route, navigation }: routeType) => {

  const session = useContext(sessioncontext);

  return (
    <Modal
      onRequestClose={async () => {
        navigation.goBack();
      }}
      transparent={true}
      animationType="fade"
    >
      <View></View>
    </Modal>
  );
};

export default AttachmentModal;
