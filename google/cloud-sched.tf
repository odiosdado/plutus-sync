data "google_compute_default_service_account" "default" {
}

resource "google_cloud_scheduler_job" "job" {
  name             = "plutus-sync-job"
  description      = "Monthly run of plutus-sync"
  schedule         = "0 1 15 * *"
  time_zone        = "America/Chicago"
  attempt_deadline = "320s"
  region           = "us-central1"

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "POST"
    uri         = "${google_cloud_run_service.default.status[0].url}/run-sync"
    oidc_token {
      service_account_email = data.google_compute_default_service_account.default.email
    }
  }
}