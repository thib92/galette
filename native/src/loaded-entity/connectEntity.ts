import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import WaitUntilEntityIsLoadedFactory from "./components/WaitUntilEntityIsLoadedFactory";

type Action = {
  type: string;
  [x: string]: any;
};
type ConnectEntityOptions = {
  property: string;
  loadEntityAction: (identifier: string) => Action;
  entitySelector: (state: any, identifier: string) => any; // TODO: Should `state` be typed with a generic?
  identifierFromPropsResolver: (props: any) => string; // TODO: should props be typed a little more?
}

export default function connectEntity(options : ConnectEntityOptions)
{
  return <P extends any>(DecoratedComponent: React.ComponentType<P>) => connect((state: any, props: P) => {
    let identifier = options.identifierFromPropsResolver(props);

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
      props.loadEntity(
        options.identifierFromPropsResolver(props)
      )
    },
    objectIsLoaded: (props) => {
      return !!props[options.property];
    }
  }));
};
