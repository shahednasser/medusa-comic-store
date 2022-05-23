import {
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
  connectStateResults
} from "react-instantsearch-dom"

import React from "react"
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"

const searchClient = instantMeiliSearch(
  process.env.GATSBY_MEILISEARCH_HOST,
  process.env.GATSBY_MEILISEARCH_API_KEY
)

const Search = () => {
  const Results = connectStateResults(({ searchState, searchResults, children }) =>
    searchState && searchState.query && searchResults && searchResults.nbHits !== 0 ? (
      <div className="absolute top-full w-full p-2 bg-gray-200 shadow-md">
        {children}
      </div>
    ) : (
      <div></div>
    )
  );

  return (
    <div className="relative">
      <InstantSearch indexName="products" searchClient={searchClient}>
        <SearchBox submit={null} reset={null} />
        <Results>
          <Hits hitComponent={Hit} />
        </Results>
      </InstantSearch>
    </div>
  )
}

const Hit = ({ hit }) => {
  return (
    <div key={hit.id} className="relative">
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </div>
    </div>
  )
}

export default Search;