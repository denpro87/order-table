export interface Country {
  name?: string;
  code?: string;
}

export interface Representative {
  name?: string;
  image?: string;
}

export interface Customer {
  id?: number;
  name?: string;
  country?: string;
  company?: string;
  date?: string | Date;
  status?: string;
  activity?: number;
  representative?: Representative;
  verified?: boolean;
  balance?: number;
}

export interface Order {
  id: string;
  productCode?: string;
  date?: string | Date;
  amount?: number;
  quantity?: number;
  seller?: string;
  status?: string;
}
