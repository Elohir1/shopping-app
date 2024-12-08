export interface Member {
  id: string
  email: string
  isOwner: boolean
}

export interface Polozka {
  nazev: string
  splneno: boolean
}

export interface Seznam {
  id: number
  nazev: string
  polozky: Polozka[]
  archivovano: boolean
  members: Member[]
}