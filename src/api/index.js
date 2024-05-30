import axios from "../helpers/axios";

export function getProjects(options) {
  return axios.post("projects/list", options).then((response) => response.data);
}
