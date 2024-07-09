import * as React from 'react'
import { Paper, IconButton, InputBase, Menu, MenuItem} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { SxProps } from '@mui/material'
import { useState } from 'react'
import { ChangeEvent, FormEvent } from 'react'
import { ItemStatus, SearchRequest, SearchType, Sort } from '../../interfaces'
import { FilterAlt } from '@mui/icons-material'
import NumericInput from './NumericOnlyInput'
import SelectInput from './SelectInput'

const BASELAT: string = process.env.BASE_LATITUDE ?? ""; // ?? "" only exists to prevent type errors. It should never be reached.
const BASELONG: string = process.env.BASE_LONGITUDE ?? ""; // ?? "" only exists to prevent type errors. It should never be reached.
const BASESEARCHLIMIT: number = parseInt(process.env.DEFAULT_BULK_RETURN_LIMIT ?? "0"); // ?? "0" only exists to prevent type errors. It should never be reached.

interface Props {
  id: string
  placeholder?: string | undefined
  sx?: SxProps | undefined
  submit: (out: SearchRequest) => void
  previousSearchRequest?: SearchRequest | undefined
}

const Searchbox: React.FC<Props> = ({ placeholder, sx, id, submit, previousSearchRequest }) => {
  const existingSearchInputs: SearchRequest | undefined = previousSearchRequest;
  const [query, setQuery] = useState<string>(existingSearchInputs?.query ?? '')
  const [minPrice, setMinPrice] = useState<string | null>(existingSearchInputs?.minPrice?.toString() ?? null)
  const [maxPrice, setMaxPrice] = useState<string | null >(existingSearchInputs?.maxPrice?.toString() ?? null)
  const [status, setStatus] = useState<string>(existingSearchInputs?.status ?? ItemStatus.AVAILABLE)
  const [searchType, setSearchType] = useState<string>(existingSearchInputs?.searchType ?? SearchType.LISTINGS)
  const [latitude, setLatitude] = useState<string>(existingSearchInputs?.latitude?.toString() ?? BASELAT)
  const [longitude, setLongitude] = useState<string>(existingSearchInputs?.longitude?.toString() ?? BASELONG)


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    handleClick();
    }

  const handleClick = () => {
    const newQuery: SearchRequest = {
      query: query,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      status: status as ItemStatus,
      searchType: searchType as SearchType,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      sort: existingSearchInputs?.sort ?? Sort.RELEVANCE,
      page: existingSearchInputs?.page ?? 1,
      limit: existingSearchInputs?.limit ?? BASESEARCHLIMIT,
    }
    submit(newQuery)
  }


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper component="form" sx={sx} id={id} onSubmit={handleSubmit}>
      <InputBase
        id="Search Field"
        placeholder={placeholder}
        sx={{ ml: 1, flex: 1 }}
        onChange={handleChange}
      />
       <IconButton
        aria-label="filters"
        id="filter-button"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleMenuButtonClick}
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
          <NumericInput label='Min Price' placeholder={minPrice} onChange={(value: string | null) => {setMinPrice(value)}}/>             
        </MenuItem>
        <MenuItem>
          <NumericInput label='Max Price' placeholder={maxPrice} onChange={(value: string | null) => {setMaxPrice(value)}}/>             
        </MenuItem>
        <MenuItem>
          <SelectInput label='Status' defaultVal={status} onChange={(value: string | null) => {setStatus(value ?? ItemStatus.AVAILABLE)}} options={ Object.values(ItemStatus)}/>
        </MenuItem>
        <MenuItem>
          <SelectInput label='Search Type' defaultVal={searchType} onChange={(value: string | null) => {setSearchType(value ?? SearchType.LISTINGS)}} options={ Object.values(SearchType)}/>
        </MenuItem>
        <MenuItem>
          <NumericInput label='Latitude' placeholder={latitude} onChange={(value: string | null) => {setLatitude(value ?? BASELAT)}}/>
        </MenuItem>
        <MenuItem>
          <NumericInput label='Latitude' placeholder={longitude} onChange={(value: string | null) => {setLongitude(value ?? BASELONG)}}/>
        </MenuItem>
      </Menu>  
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={handleClick}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default Searchbox
