import * as React from 'react'
import { Paper, IconButton, InputBase, Menu, MenuItem } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { SxProps } from '@mui/material'
import { useState } from 'react'
import { ChangeEvent, FormEvent } from 'react'
import { ItemStatus, SearchRequest, SearchType, Sort } from '../../interfaces'
import { FilterAlt } from '@mui/icons-material'
import NumericInput from './NumericOnlyInput'
import SelectInput from './SelectInput'


interface Props {
  id: string
  placeholder?: string | undefined
  sx?: SxProps | undefined
  submit: (out: SearchRequest) => void
  previousSearchRequest?: SearchRequest | undefined
}

const Searchbox: React.FC<Props> = ({ placeholder, sx, id, submit, previousSearchRequest }) => {
  const BASELAT: string = process.env.REACT_APP_BASE_LATITUDE ?? "48.4631"; // ?? "" only exists to prevent type errors. It should never be reached.
  const BASELONG: string = process.env.REACT_APP_BASE_LONGITUDE ?? "123.3122"; // ?? "" only exists to prevent type errors. It should never be reached.
  const BASESEARCHLIMIT: number = parseInt(process.env.REACT_APP_DEFAULT_BULK_RETURN_LIMIT ?? "20"); // ?? "0" only exists to prevent type errors. It should never be reached.

  const [query, setQuery] = useState<string | undefined>(previousSearchRequest?.query ?? '')
  const [minPrice, setMinPrice] = useState<string | undefined>(previousSearchRequest?.minPrice?.toString() ?? undefined)
  const [maxPrice, setMaxPrice] = useState<string | undefined>(previousSearchRequest?.maxPrice?.toString() ?? undefined)
  const [status, setStatus] = useState<string>(previousSearchRequest?.status ?? ItemStatus.AVAILABLE)
  const [searchType, setSearchType] = useState<string>(previousSearchRequest?.searchType ?? SearchType.LISTINGS)
  const [latitude, setLatitude] = useState<string>(previousSearchRequest?.latitude?.toString() ?? BASELAT)
  const [longitude, setLongitude] = useState<string>(previousSearchRequest?.longitude?.toString() ?? BASELONG)
  const [hasError, setHasError] = useState<number>(0)


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    handleClick();
  }

  const handleClick = () => {
    if (hasError <= 0 && query !== undefined) {
      const newQuery: SearchRequest = {
        query: query!,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        status: status as ItemStatus,
        searchType: searchType as SearchType,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        sort: previousSearchRequest?.sort ?? Sort.RELEVANCE,
        page: previousSearchRequest?.page ?? 1,
        limit: previousSearchRequest?.limit ?? BASESEARCHLIMIT,
      }
      submit(newQuery)
    }
  }


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const onInvalidInputs = (value: boolean) => {
    setHasError(hasError + (value ? 1 : -1));
  }

  return (
    <Paper component="form" sx={sx} id={id} onSubmit={handleSubmit}>
      <InputBase
        id="Search Field"
        data-testid="search-field"
        placeholder={placeholder}
        sx={{ ml: 1, flex: 1 }}
        value={query ?? undefined}
        onChange={handleChange}
      />
      <IconButton
        aria-label="filters"
        id="filter-button"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleMenuButtonClick}
        color={hasError > 0 ? 'error' : 'default'}
      >
        <FilterAlt />
      </IconButton>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <NumericInput label='Min Price' placeholder={minPrice} onChange={(value: string | undefined) => { setMinPrice(value) }} onError={onInvalidInputs} />
        </MenuItem>
        <MenuItem>
          <NumericInput label='Max Price' placeholder={maxPrice} onChange={(value: string | undefined) => { setMaxPrice(value) }} onError={onInvalidInputs} />
        </MenuItem>
        <MenuItem>
          <SelectInput label='Status' defaultVal={status} onChange={(value: string | undefined) => { setStatus(value ?? ItemStatus.AVAILABLE) }} options={Object.values(ItemStatus)} />
        </MenuItem>
        <MenuItem>
          <SelectInput label='Search Type' defaultVal={searchType} onChange={(value: string | undefined) => { setSearchType(value ?? SearchType.LISTINGS) }} options={Object.values(SearchType)} />
        </MenuItem>
        <MenuItem>
          <NumericInput label='Latitude' placeholder={latitude} onChange={(value: string | undefined) => { setLatitude(value ?? BASELAT) }} onError={onInvalidInputs} />
        </MenuItem>
        <MenuItem>
          <NumericInput label='Longitude' placeholder={longitude} onChange={(value: string | undefined) => { setLongitude(value ?? BASELONG) }} onError={onInvalidInputs} />
        </MenuItem>
      </Menu>
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={handleClick}
        color={hasError > 0 ? 'error' : 'default'}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default Searchbox
