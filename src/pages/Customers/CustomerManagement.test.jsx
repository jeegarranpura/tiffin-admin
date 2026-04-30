import React, { Suspense } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerManagement from './CustomerManagement';

// Mock the lazy components to simplify testing
jest.mock('../../components/Common/Button', () => ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props} data-testid="mock-button">{children}</button>
));
jest.mock('../../components/Common/Badge', () => ({ children }) => <span data-testid="mock-badge">{children}</span>);
jest.mock('../../components/Common/Table', () => ({ tableData }) => (
  <div data-testid="mock-table">
    {tableData.map(item => <div key={item.id}>{item.name}</div>)}
  </div>
));
jest.mock('../../components/Common/SlideOver', () => ({ children, isOpen, title }) => (
  isOpen ? <div data-testid="mock-slideover"><h2>{title}</h2>{children}</div> : null
));
jest.mock('../../components/Common/Modal', () => ({ children, isOpen }) => (
  isOpen ? <div data-testid="mock-modal">{children}</div> : null
));
jest.mock('./Components/GoogleMap', () => () => <div data-testid="mock-google-map" />);

const mockProps = {
  customerList: [
    { id: 1, name: 'John Doe', phone: '1234567890', address: '123 Main St', type: 'monthly', isActive: true, planId: 'plan1' },
    { id: 2, name: 'Jane Smith', phone: '0987654321', address: '456 Oak St', type: 'trial', isActive: false, planId: 'plan2' },
  ],
  isLoading: false,
  error: null,
  planList: [
    { id: 'plan1', name: 'Basic Plan' },
    { id: 'plan2', name: 'Premium Plan' },
  ],
  fetchCustomerList: jest.fn(),
  fetchCreateCustomer: jest.fn(),
  fetchUpdateCustomer: jest.fn(),
};

describe('CustomerManagement Component', () => {
  test('renders customer management page with title', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CustomerManagement {...mockProps} />
      </Suspense>
    );

    expect(await screen.findByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Manage and view all your subscribers.')).toBeInTheDocument();
  });

  test('renders the customer list in the table', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CustomerManagement {...mockProps} />
      </Suspense>
    );

    expect(await screen.findByTestId('mock-table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('opens add customer modal when clicking add button', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CustomerManagement {...mockProps} />
      </Suspense>
    );

    const addButton = await screen.findByText('Add Customer');
    fireEvent.click(addButton);

    expect(screen.getByText('Add New Customer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. John Doe')).toBeInTheDocument();
  });

  test('filters customers by type', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CustomerManagement {...mockProps} />
      </Suspense>
    );

    const monthlyFilter = await screen.findByText('Monthly');
    fireEvent.click(monthlyFilter);

    // After filtering by monthly, only John Doe should be visible (mock logic in component)
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // In our mock table, we render all tableData. If the component filters correctly, 
    // the tableData prop passed to our mock Table should only contain John Doe.
    // However, Jane Smith might still be in the DOM if we don't handle the mock correctly.
    // Let's refine the mock or check the table content.
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});
