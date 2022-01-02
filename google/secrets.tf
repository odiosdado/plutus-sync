data "google_project" "project" {
}

resource "google_secret_manager_secret" "fmp" {
  secret_id = "fmp_api_key"
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "fmp_data" {
  secret      = google_secret_manager_secret.fmp.name
  secret_data = var.fmp_api_key
}

resource "google_secret_manager_secret" "gcp" {
  secret_id = "gcp_creds"
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "gcp_data" {
  secret      = google_secret_manager_secret.gcp.name
  secret_data = var.gcp_service_account
}

resource "google_secret_manager_secret_iam_member" "gcp_access" {
  secret_id = google_secret_manager_secret.gcp.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "fmp_access" {
  secret_id = google_secret_manager_secret.fmp.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}