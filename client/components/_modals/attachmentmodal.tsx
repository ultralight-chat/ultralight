import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Props } from "../../App";
import { useContext } from "react";
import { sessioncontext } from "../contextprovider";
import { Modal, Pressable, View } from "react-native";

type routeType = NativeStackScreenProps<Props, "MessageContext">;

const AttachmentModal = ({ route, navigation }: routeType) => {
  const { thread, attachment } = route.params.vm;
  const { message } = route.params;

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
