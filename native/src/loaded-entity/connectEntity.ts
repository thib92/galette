import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import WaitUntilEntityIsLoadedFactory from "./components/WaitUntilEntityIsLoadedFactory";

type Action = {
  type: string;
  [x: string]: any;
};
type ConnectEntityOptions<State> = {
  property: string;
  loadEntityAction?: (identifier: string) => Action;
  entitySelector: (state: State, identifier: string) => any; // TODO: Should `state` be typed with a generic?
  identifierFromPropsResolver?: (props: any) => string; // TODO: should props be typed a little more?
}

export default function connectEntity<State>(options : ConnectEntityOptions<State>)
{
  return <P extends any>(DecoratedComponent: React.ComponentType<P>) => connect((state: State, props: P) => {
    if (options.identifierFromPropsResolver) {
      let identifier = options.identifierFromPropsResolver(props);
    } else {
    }

    let identifier = options.identifierFromPropsResolver ? options.identifierFromPropsResolver(props) : undefined;

    return {
      [options.property]: options.entitySelector(state, identifier),
    }

  }, dispatch => {
    return bindActionCreators({
      loadEntity: options.loadEntityAction,
    }, dispatch);
  })(WaitUntilEntityIsLoadedFactory(DecoratedComponent, {
    havePropertiesChanged: (prevProps, newProps) => {
      return prevProps[options.property] !== newProps[options.property];
    },
    loadObject: (props) => {
      if (props.loadEntity) {
        props.loadEntity(
          options.identifierFromPropsResolver(props)
        )
      }
    },
    objectIsLoaded: (props) => {
      return !!props[options.property];
    }
  }));
};
