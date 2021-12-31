provider "google" {
  project = "plutus-273220"
}
provider "google-beta" {
  project = "plutus-273220"
}

resource "google_bigquery_dataset" "plutus" {
  dataset_id    = "plutus_sync"
  friendly_name = "plutus sync"
  description   = "Dataset to contain plutus stock data"
}

resource "google_bigquery_table" "default" {
  deletion_protection = false
  dataset_id          = google_bigquery_dataset.plutus.dataset_id
  table_id            = "stocks"
  schema              = file("${path.module}/schema.json")
  labels              = {}
  lifecycle {
    ignore_changes = [
      last_modified_time,
      num_bytes,
      num_rows
    ]
  }
}

resource "google_artifact_registry_repository" "plutus_repo" {
  provider      = google-beta
  repository_id = "plutus-sync"
  description   = "Docker repo to store plutus-sync"
  format        = "DOCKER"
}