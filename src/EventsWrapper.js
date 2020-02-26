import React, { Component, Fragment } from "react";

import Button from "react-bootstrap/Button";
import { Subscription } from "react-apollo";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";

import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";
import gql from "graphql-tag";

const SUBSCRIBE = gql`
  subscription {
    eventCreated {
      content
      id
      type
      time
      status
    }
  }
`;

const handleClick = e => {
  e.preventDefault();
  fetch("/run");
};
const LoadingMessage = () => (
  <div className="alert alert-info" role="alert">
    <strong>Start the process...</strong>
    <Button variant="outline-primary" onClick={handleClick}>
      Start
    </Button>
  </div>
);

class DisplayEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success_progress: 0,
      warning_progress: 0,
      danger_progres: 0
    };
  }

  render() {
    const isFinished = this.props.data.eventCreated.type;
    let button;
    if (isFinished === "FINISHED_TYPE") {
      button = <LoadingMessage />;
    } else {
      button = "";
    }

    return (
      <React.Fragment>
        <ProgressBar>
          <ProgressBar
            striped
            animated
            variant="success"
            now={this.state.success_progress}
            key={1}
          />
          <ProgressBar
            striped
            animated
            variant="warning"
            now={this.state.warning_progress}
            key={2}
          />
          <ProgressBar
            striped
            animated
            variant="danger"
            now={this.state.danger_progres}
            key={3}
          />
        </ProgressBar>

        <Alert variant={"primary"}>
          <p>This is a detailed view of the event process.</p>
          <p>
            Process number: <b>{this.props.data.eventCreated.id}</b> has
            finished in {this.props.data.eventCreated.time} seconds.
          </p>
          <ul>
            <li>{this.props.data.eventCreated.content}</li>
            <li>
              <b>PID</b>: {this.props.data.eventCreated.id}
            </li>
            <li>
              <b>Type:</b> {this.props.data.eventCreated.type}
            </li>

            <li>
              <b>TTL:</b> {this.props.data.eventCreated.time} seconds
            </li>
          </ul>
        </Alert>
        <div>{button}</div>
      </React.Fragment>
    );
  }
}

const EventWrapper = () => (
  <Subscription
    subscription={SUBSCRIBE}
    onSubscriptionData={opts => {
      const data = opts.subscriptionData;
      const param = data.data.eventCreated;
      store.addNotification({
        title: "PID: " + param.id,
        message: param.content + "Status: " + param.status,
        type: param.status,
        insert: "top",
        container: "top-center",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 10000,
          onScreen: true
        }
      });
    }}
  >
    {result => {
      const { data, loading, error } = result;
      if (error) {
        return <div>Error! {error.message}</div>;
      }
      if (loading) {
        return <LoadingMessage />;
      }
      if (data) {
        return (
          <>
            <h4>Process: {data.eventCreated.content}</h4>
            <DisplayEvent data={data} />
          </>
        );
      }
    }}
  </Subscription>
);
export default EventWrapper;
