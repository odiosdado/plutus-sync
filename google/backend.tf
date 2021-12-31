terraform {
  cloud {
    organization = "oddevs"
    workspaces {
      name = "plutus-sync-google"
    }
  }
}