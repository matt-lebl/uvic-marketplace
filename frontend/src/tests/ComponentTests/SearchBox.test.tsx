import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { ItemStatus, SearchRequest, SearchType, Sort } from '../../interfaces'
import Searchbox from '../../pages/Components/SearchBox'

const mockSubmit = jest.fn()

const mockOnSearch = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

describe('Searchbox', () => {
  const BASELAT: string = process.env.REACT_APP_BASE_LATITUDE ?? '' // ?? "" only exists to prevent type errors. It should never be reached.
  const BASELONG: string = process.env.REACT_APP_BASE_LONGITUDE ?? '' // ?? "" only exists to prevent type errors. It should never be reached.
  const BASESEARCHLIMIT: number = parseInt(
    process.env.REACT_APP_DEFAULT_BULK_RETURN_LIMIT ?? ''
  ) // ?? "0" only exists to prevent type errors. It should never be reached.

  const defaultInitalProps = {
    id: 'test-searchbox',
    placeholder: 'Search...',
    submit: mockSubmit,
  }

  const testSearchRequest: SearchRequest = {
    query: 'test query',
    minPrice: 100,
    maxPrice: 200,
    status: ItemStatus.SOLD,
    searchType: SearchType.USERS,
    latitude: 0,
    longitude: 0,
    sort: Sort.RELEVANCE,
    page: 1,
    limit: 20,
  }

  const carryoverInitalProps = {
    id: 'test-searchbox',
    placeholder: 'Search...',
    submit: mockSubmit,
    previousSearchRequest: testSearchRequest,
  }

  beforeEach(() => {
    mockSubmit.mockClear()
  })

  test('renders with default values and elements', () => {
    render(<Searchbox {...defaultInitalProps} />)

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByLabelText('filters')).toBeInTheDocument()
    expect(screen.getByLabelText('search')).toBeInTheDocument()
  })

  test('opens filter menu when filter icon is clicked with default values', () => {
    render(<Searchbox {...defaultInitalProps} />)

    const filterButton = screen.getByLabelText('filters')
    fireEvent.click(filterButton)

    var minPriceElement = screen.getByLabelText('Min Price') as HTMLInputElement
    expect(minPriceElement).toBeInTheDocument()
    expect(minPriceElement).toHaveValue('')

    var maxPriceElement = screen.getByLabelText('Max Price') as HTMLInputElement
    expect(maxPriceElement).toBeInTheDocument()
    expect(maxPriceElement).toHaveValue('')

    var statusElement = screen.getByTestId('Status-simple-select')
    expect(statusElement).toBeInTheDocument()
    expect(statusElement.firstElementChild?.textContent).toBe(
      ItemStatus.AVAILABLE
    )
    fireEvent.mouseDown(statusElement.firstElementChild!)
    Object.values(ItemStatus).forEach((value) => {
      const options = screen.getAllByRole('option')
      const filteredOptions = options.filter(
        (option) => option.textContent === value.replace('_', ' ')
      )
      expect(filteredOptions.length).toBe(1)
    })

    var searchTypeElement = screen.getByTestId('Search Type-simple-select')
    expect(searchTypeElement).toBeInTheDocument()
    expect(searchTypeElement.firstElementChild?.textContent).toBe(
      SearchType.LISTINGS
    )
    fireEvent.mouseDown(searchTypeElement.firstElementChild!)
    Object.values(SearchType).forEach((value) => {
      const options = screen.getAllByRole('option')
      const filteredOptions = options.filter(
        (option) => option.textContent === value.replace('_', ' ')
      )
      expect(filteredOptions.length).toBe(1)
    })

    var latElement = screen.getByLabelText('Latitude')
    expect(latElement).toBeInTheDocument()
    expect(latElement).toHaveValue(BASELAT) //If this is failing, because it expects "", but gets "123.3122", then environmental variables are not being set, and Searchbox is falling back on it's secondary backup.

    var longElement = screen.getByLabelText('Longitude') as HTMLInputElement
    expect(longElement).toBeInTheDocument()
    expect(longElement).toHaveValue(BASELONG) //If this is failing, because it expects "", but gets "48.4631", then environmental variables are not being set, and Searchbox is falling back on it's secondary backup.
  })

  test('opens filter menu when filter icon is clicked with prior search values', () => {
    render(<Searchbox {...carryoverInitalProps} />)
    const filterButton = screen.getByLabelText('filters')
    fireEvent.click(filterButton)

    expect(screen.getByLabelText('Min Price')).toHaveValue(
      testSearchRequest.minPrice?.toString()
    )
    expect(screen.getByLabelText('Max Price') as HTMLInputElement).toHaveValue(
      testSearchRequest.maxPrice?.toString()
    )
    expect(
      screen.getByTestId('Status-simple-select').firstElementChild?.textContent
    ).toBe(testSearchRequest.status?.toString())
    expect(
      screen.getByTestId('Search Type-simple-select').firstElementChild
        ?.textContent
    ).toBe(testSearchRequest.searchType?.toString())
    expect(screen.getByLabelText('Latitude') as HTMLInputElement).toHaveValue(
      testSearchRequest.latitude?.toString()
    )
    expect(screen.getByLabelText('Longitude') as HTMLInputElement).toHaveValue(
      testSearchRequest.longitude?.toString()
    )
  })

  test('filter menu can be interacted with and calls expected methods', () => {
    render(<Searchbox {...defaultInitalProps} />)

    const filterButton = screen.getByLabelText('filters')
    fireEvent.click(filterButton)

    const minPriceInput = screen.getByLabelText('Min Price')
    fireEvent.change(minPriceInput, {
      target: { value: testSearchRequest.minPrice?.toString() },
    })
    expect(minPriceInput).toHaveValue(testSearchRequest.minPrice?.toString())

    const maxPriceInput = screen.getByLabelText('Max Price')
    fireEvent.change(maxPriceInput, {
      target: { value: testSearchRequest.maxPrice?.toString() },
    })
    expect(maxPriceInput).toHaveValue(testSearchRequest.maxPrice?.toString())
  })

  test('text box can be input to', () => {
    render(<Searchbox {...defaultInitalProps} />)

    const searchField = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchField, { target: { value: 'test query' } })
    expect(searchField).toHaveValue('test query')
  })

  test('clicking the search icon triggers the submit function', () => {
    render(<Searchbox {...defaultInitalProps} />)

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: testSearchRequest.query },
    })
    fireEvent.change(screen.getByLabelText('Min Price'), {
      target: { value: testSearchRequest.minPrice?.toString() },
    })
    fireEvent.change(screen.getByLabelText('Max Price'), {
      target: { value: testSearchRequest.maxPrice?.toString() },
    })
    fireEvent.mouseDown(
      screen.getByTestId('Status-simple-select').firstElementChild!
    )
    fireEvent.click(screen.getByText(testSearchRequest.status!.toString()))
    fireEvent.mouseDown(
      screen.getByTestId('Search Type-simple-select').firstElementChild!
    )
    fireEvent.click(screen.getByText(testSearchRequest.searchType!.toString()))
    fireEvent.change(screen.getByLabelText('Latitude'), {
      target: { value: testSearchRequest.latitude?.toString() },
    })
    fireEvent.change(screen.getByLabelText('Longitude'), {
      target: { value: testSearchRequest.longitude?.toString() },
    })

    const searchIcon = screen.getByLabelText('search')
    fireEvent.click(searchIcon)

    expect(mockSubmit).toHaveBeenCalledWith(testSearchRequest)
  })

  test('clicking the search icon with invalid filter values does not call submit', () => {
    render(<Searchbox {...defaultInitalProps} />)

    const filterButton = screen.getByLabelText('filters')
    fireEvent.click(filterButton)

    const minPriceInput = screen.getByLabelText('Min Price')
    fireEvent.change(minPriceInput, { target: { value: 'invalid' } })

    const searchIcon = screen.getByLabelText('search')
    fireEvent.click(searchIcon)

    expect(mockSubmit).not.toHaveBeenCalled()
  })
})
