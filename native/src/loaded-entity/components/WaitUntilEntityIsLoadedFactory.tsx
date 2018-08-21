import React from "react";
import {ActivityIndicator, View} from "react-native";

export type Descriptor<P> = {
  havePropertiesChanged: (prevProps: P, props: P) => boolean,
  objectIsLoaded: (props: P) => boolean,
  loadObject?: (props: P) => void,
};

type State = {
  isLoading: boolean;
}

export default function WaitUntilEntityIsLoadedFactory <P extends any>(DecoratedComponent: React.ComponentType<P>, descriptor: Descriptor<P>) {
  return class extends React.Component<P, State> {
    // @ts-ignore
    static navigationOptions = DecoratedComponent.navigationOptions;

    constructor(props: P) {
      super(props);

      this.state = {
        isLoading: false
      };
    }

    componentDidMount() {
      this.ensureObjectIsLoaded();
    }

  componentDidUpdate(prevProps: P) {
      if (descriptor.havePropertiesChanged(prevProps, this.props)) {
        this.ensureObjectIsLoaded();
      }
    }

    ensureObjectIsLoaded() {
      if (!descriptor.objectIsLoaded(this.props)) {
        if (!this.state.isLoading) {
          this.setState({
            isLoading: true
          });
          if (descriptor.loadObject) {
            descriptor.loadObject(this.props);
          }
        }
      } else if (this.state.isLoading) {
        this.setState({
          isLoading: false
        });
      }
    }

    render() {
      if (!descriptor.objectIsLoaded(this.props)) {
        return (
          <View style={{
          position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
        <ActivityIndicator
          size="small"
        color={"#fff"}/>
        </View>
      )
      }

      return <DecoratedComponent {...this.props} />
    }
  }
};
