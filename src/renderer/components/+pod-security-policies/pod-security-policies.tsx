import "./pod-security-policies.scss";

import React from "react";
import { observer } from "mobx-react";
import { KubeObjectListLayout } from "../kube-object";
import { podSecurityPoliciesStore } from "./pod-security-policies.store";
import { PodSecurityPolicy } from "../../api/endpoints";
import { KubeObjectStatusIcon } from "../kube-object-status-icon";

enum sortBy {
  name = "name",
  volumes = "volumes",
  privileged = "privileged",
  age = "age",
}

@observer
export class PodSecurityPolicies extends React.Component {
  render() {
    return (
      <KubeObjectListLayout
        className="PodSecurityPolicies"
        isClusterScoped={true}
        store={podSecurityPoliciesStore}
        sortingCallbacks={{
          [sortBy.name]: (item: PodSecurityPolicy) => item.getName(),
          [sortBy.volumes]: (item: PodSecurityPolicy) => item.getVolumes(),
          [sortBy.privileged]: (item: PodSecurityPolicy) => +item.isPrivileged(),
          [sortBy.age]: (item: PodSecurityPolicy) => item.metadata.creationTimestamp,
        }}
        searchFilters={[
          (item: PodSecurityPolicy) => item.getSearchFields(),
          (item: PodSecurityPolicy) => item.getVolumes(),
          (item: PodSecurityPolicy) => Object.values(item.getRules()),
        ]}
        renderHeaderTitle="Pod Security Policies"
        renderTableHeader={[
          { title: "Name", className: "name", sortBy: sortBy.name },
          { className: "warning" },
          { title: "Privileged", className: "privileged", sortBy: sortBy.privileged },
          { title: "Volumes", className: "volumes", sortBy: sortBy.volumes },
          { title: "Age", className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(item: PodSecurityPolicy) => {
          return [
            item.getName(),
            <KubeObjectStatusIcon key="icon" object={item} />,
            item.isPrivileged() ? "Yes" : "No",
            item.getVolumes().join(", "),
            item.getAge(),
          ];
        }}
      />
    );
  }
}
