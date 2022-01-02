resource "google_container_registry" "registry" {
}

output "container_registry" {
  value = google_container_registry.registry
}