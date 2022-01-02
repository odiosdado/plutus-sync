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