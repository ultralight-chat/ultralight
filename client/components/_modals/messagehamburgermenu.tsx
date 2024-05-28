import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Props } from "../../App";

const user = null;
// useContext(usercontext);
type routeType = NativeStackScreenProps<Props, "MessageContext">;

const MessageHamburgerMenu = ({ route }: routeType) => {
  const {} = route.params;
};

export default MessageHamburgerMenu;
