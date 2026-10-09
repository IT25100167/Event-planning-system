const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';
const FINANCE_BASE = `${API_BASE_URL}/api/finance`;

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type PaymentStatus =
  | 'PENDING'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'REFUNDED';
export type VendorPaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type TransactionType =
  | 'CUSTOMER_PAYMENT'
  | 'VENDOR_PAYMENT'
  | 'REFUND'
  | 'ADJUSTMENT';

export interface CreateQuotationRequest {
  bookingId: string;
  packageId?: string;
  subtotal: number;
  discountPercent?: number;
}

export interface Quotation {
  quotationId: string;
  bookingId: string;
  packageId?: string | null;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  estimatedTotal: number;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  bookingId: string;
  customerEmail: string;
  baseAmount: number;
  discountPercent?: number;
  dueDate?: string;
}

export interface Invoice {
  invoiceId: string;
  bookingId: string;
  customerEmail: string;
  baseTotal: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  finalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: PaymentStatus;
  issuedDate: string;
  dueDate: string;
}

export interface RecordCustomerPaymentRequest {
  amount: number;
  paymentMethod: string;
  reference?: string;
}

export interface CustomerPayment {
  paymentId: string;
  invoiceId: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  reference?: string | null;
  paidAt: string;
}

export interface EventBudget {
  eventId: number;
  allocatedBudget: number;
  actualSpend: number;
  variance: number;
  utilizationPercentage: number;
  status: string;
}

export interface CreateVendorPaymentRequest {
  eventId: number;
  vendorId: number;
  serviceDescription: string;
  amount: number;
  dueDate: string;
}

export interface VendorPayment {
  vendorPaymentId: string;
  eventId: number;
  vendorId: number;
  serviceDescription: string;
  amount: number;
  dueDate: string;
  paidDate?: string | null;
  status: VendorPaymentStatus;
  paymentReference?: string | null;
  createdAt: string;
}

export interface FinancialRecord {
  transactionId: string;
  bookingId?: string | null;
  eventId?: number | null;
  type: TransactionType;
  amount: number;
  direction: string;
  reference?: string | null;
  transactionDate: string;
}

export interface FinancialSummary {
  totalCustomerRevenue: number;
  totalVendorExpenses: number;
  outstandingCustomerReceivables: number;
  outstandingVendorPayables: number;
  netCashFlow: number;
  invoiceCount: number;
  paidInvoiceCount: number;
  pendingVendorPaymentCount: number;
}

class FinanceService {
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();

    const response = await fetch(`${FINANCE_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const data = await response.json();
        message = data.message || data.error || message;
      } catch {
        try {
          const text = await response.text();
          if (text) message = text;
        } catch {
          // Keep fallback message.
        }
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  getSummary(): Promise<FinancialSummary> {
    return this.request<FinancialSummary>('/summary');
  }

  getQuotations(bookingId?: string): Promise<Quotation[]> {
    const query = bookingId ? `?bookingId=${encodeURIComponent(bookingId)}` : '';
    return this.request<Quotation[]>(`/quotations${query}`);
  }

  createQuotation(data: CreateQuotationRequest): Promise<Quotation> {
    return this.request<Quotation>('/quotations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateQuotationStatus(quotationId: string, status: QuotationStatus): Promise<Quotation> {
    return this.request<Quotation>(`/quotations/${encodeURIComponent(quotationId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  getInvoices(bookingId?: string, paymentStatus?: PaymentStatus | ''): Promise<Invoice[]> {
    const params = new URLSearchParams();
    if (bookingId) params.set('bookingId', bookingId);
    if (paymentStatus) params.set('paymentStatus', paymentStatus);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Invoice[]>(`/invoices${query}`);
  }

  getInvoice(invoiceId: string): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${encodeURIComponent(invoiceId)}`);
  }

  createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
    return this.request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getCustomerPayments(invoiceId: string): Promise<CustomerPayment[]> {
    return this.request<CustomerPayment[]>(
      `/invoices/${encodeURIComponent(invoiceId)}/payments`
    );
  }

  recordCustomerPayment(
    invoiceId: string,
    data: RecordCustomerPaymentRequest
  ): Promise<CustomerPayment> {
    return this.request<CustomerPayment>(
      `/invoices/${encodeURIComponent(invoiceId)}/payments`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async downloadInvoicePdf(invoiceId: string): Promise<void> {
    const token = this.getToken();
    const response = await fetch(
      `${FINANCE_BASE}/invoices/${encodeURIComponent(invoiceId)}/pdf`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    if (!response.ok) {
      throw new Error(`Unable to download invoice PDF (${response.status})`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Invoice-${invoiceId}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  getBudget(eventId: number): Promise<EventBudget> {
    return this.request<EventBudget>(`/budgets/${eventId}`);
  }

  createBudget(eventId: number, allocatedBudget: number): Promise<EventBudget> {
    return this.request<EventBudget>('/budgets', {
      method: 'POST',
      body: JSON.stringify({ eventId, allocatedBudget }),
    });
  }

  updateBudget(eventId: number, allocatedBudget: number): Promise<EventBudget> {
    return this.request<EventBudget>(`/budgets/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({ allocatedBudget }),
    });
  }

  getVendorPayments(filters: {
    eventId?: number;
    vendorId?: number;
    status?: VendorPaymentStatus | '';
  } = {}): Promise<VendorPayment[]> {
    const params = new URLSearchParams();
    if (filters.eventId) params.set('eventId', String(filters.eventId));
    if (filters.vendorId) params.set('vendorId', String(filters.vendorId));
    if (filters.status) params.set('status', filters.status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<VendorPayment[]>(`/vendor-payments${query}`);
  }

  createVendorPayment(data: CreateVendorPaymentRequest): Promise<VendorPayment> {
    return this.request<VendorPayment>('/vendor-payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateVendorPaymentStatus(
    vendorPaymentId: string,
    status: VendorPaymentStatus,
    paymentReference?: string
  ): Promise<VendorPayment> {
    return this.request<VendorPayment>(
      `/vendor-payments/${encodeURIComponent(vendorPaymentId)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, paymentReference }),
      }
    );
  }

  getFinancialRecords(filters: {
    type?: TransactionType | '';
    bookingId?: string;
    eventId?: number;
  } = {}): Promise<FinancialRecord[]> {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.bookingId) params.set('bookingId', filters.bookingId);
    if (filters.eventId) params.set('eventId', String(filters.eventId));
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<FinancialRecord[]>(`/records${query}`);
  }
}

export const financeService = new FinanceService();
