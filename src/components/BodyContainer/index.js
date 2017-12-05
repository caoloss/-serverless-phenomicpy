// @flow

import React, { Component } from "react"
import { renderToString } from "react-dom/server"
// react showdown for markdown component rendering
let Showdown

type Props = {
  children: React$Element<any>
}

console.log('load BodyContainer')

// https://github.com/phenomic/phenomic/blob/master/packages/plugin-renderer-react/src/components/BodyRenderer.js
// https://github.com/phenomic/phenomic/blob/master/examples/react-app-markdown-with-custom-components/App.js

class BodyContainer extends Component<void, Props, void> {

  render(): React$Element<any> {
    const { props }: { props: Props } = this
    const { children, ...otherProps } = props

    let child
    if (typeof children === "string") {
      child = children
    } else {
      try {
        child = React.Children.only(children)
      }
      catch (e) {
        console.log("phenomic: BodyContainer: multiple childs")
      }
    }

    if (child) {
      // Is markdown string. Parse it for components
      if (typeof window !== 'undefined') {
       if (props.components) {
         Showdown = require('react-showdown')
         return (
           <Showdown.Markdown markup={ child } components={props.components} />
         )
       }
      }
      if (typeof window === 'undefined') {
        if (props.components) {
          Showdown = require('react-showdown')
          child = (
            <Showdown.Markdown markup={ child } components={props.components} />
          )
          // then SSR it
          child = renderToString(child)
        }
      }

      return (
        <div
          className="phenomic-BodyContainer"
          dangerouslySetInnerHTML={{ __html: child }}
          { ...otherProps }
        />
      )
    }

    return (
      <div { ...otherProps }>
        {
        React.Children.map(children, (child: any, i) => {
          if (typeof child === "string") {
            return (
              <div
                key={ i }
                className="phenomic-BodyContainer"
                dangerouslySetInnerHTML={{ __html: child }}
              />
            )
          }
          return child
        })
      }
      </div>
    )
  }
}

export default BodyContainer
