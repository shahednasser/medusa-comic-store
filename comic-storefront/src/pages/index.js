import CollectionPreview from "../components/categories/collection-preview"
import Grid from "../components/utility/grid"
import ProductListItem from "../components/products/product-list-item"
import React from "react"
import SearchEngineOptimization from "../components/utility/seo"
import { StaticImage } from "gatsby-plugin-image"
import { graphql } from "gatsby"
import { useCollections } from "../hooks/use-collections"

const IndexPage = ({ data }) => {
  const { products, collections } = data
  const prods = data.products.edges.map(edge => edge.node)
  const collectionPreviews = useCollections(collections, products)

  return (
    <div>
      <SearchEngineOptimization title="Home" />
      <div className="bg-ui-light pb-12 lg:pb-0 w-full px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center max-w-screen-2xl mx-auto">
          <StaticImage
            src="../images/hero.png"
            alt="A black Medusa hoodie and a white Medusa coffee mug"
            placeholder="tracedSVG"
            className="w-full lg:w-1/2 h-auto lg:my-5"
          />
          <div className="lg:ml-7">
            <h1 className="text-4xl">The Best Comic Books</h1>
            <p className="mt-2 text-lg font-normal">
              Buy the best Marvel and DC Comic Books!
            </p>
          </div>
        </div>
      </div>
      <div className="layout-base my-12 min-h-0">
        <Grid
          title={"Featured"}
          cta={{ to: "/products", text: "Browse all products" }}
        >
          {prods.slice(0, 4).map(p => {
            return <ProductListItem product={p} key={p.handle} />
          })}
        </Grid>
        <div className="mt-12">
          <Grid
            title="Shop by collection"
            cta={{ to: "/collections", text: "Browse all collections" }}
          >
            {collectionPreviews.slice(0, 4).map(collection => {
              return (
                <CollectionPreview
                  key={collection.id}
                  collection={collection}
                />
              )
            })}
          </Grid>
        </div>
      </div>
    </div>
  )
}
export const query = graphql`
  query {
    products: allMedusaProducts {
      edges {
        node {
          handle
          title
          collection_id
          thumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
          variants {
            prices {
              amount
              currency_code
            }
          }
        }
      }
    }
    collections: allMedusaCollections {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`

export default IndexPage
