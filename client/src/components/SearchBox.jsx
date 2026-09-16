import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { RouteSearch } from '@/helpers/RouteName'

const SearchBox = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState()

  const getInput = (e) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(RouteSearch(query))
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full sm:max-w-xs">
      <Input
        name="q"
        onInput={getInput}
        placeholder="Search here..."
        className="h-9 rounded-full bg-[#FFF9F2] border-[#EADFD3] text-[#4A3728] placeholder:text-[#8C7B6B] focus-visible:ring-[#D97748]/40"
      />
    </form>
  )
}

export default SearchBox