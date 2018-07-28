import ErrorWrapper from "./components/ErrorWrapper";
import ErrorMessage from "./components/ErrorMessage";
import middleware from "./middleware";
import reducer from "./reducer";
import * as actions from "./actions";

const components = {
  ErrorWrapper,
  ErrorMessage,
}

export {
  components,
  middleware,
  reducer,
  actions,
};
