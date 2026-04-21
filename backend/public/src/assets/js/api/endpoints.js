import { fetchData, postData } from "./client.js";

// Endpoints API spécifiques
export async function getServices() {
  return fetchData("/services");
}

export async function getProjects() {
  return fetchData("/projects");
}

export async function submitContact(formData) {
  return postData("/contact/submit", formData);
}
