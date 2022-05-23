import { Product } from "@medusajs/medusa"
import React from "react"
import DollarSignIcon from "../../fundamentals/icons/dollar-sign-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { CollapsibleTree } from "../../molecules/collapsible-tree"

type LeafProps = {
  id: string
  title: string
  sku?: string
  prices: {
    id: string
    currency_code: string
    amount: number
  }[]
}

type ProductVariantTreeProps = {
  product: Pick<Product, "title" | "id" | "thumbnail"> & {
    variants: LeafProps[]
  }
}

const ProductVariantTree: React.FC<ProductVariantTreeProps> = ({ product }) => {
  return (
    <CollapsibleTree>
      <CollapsibleTree.Parent
        actions={[
          {
            label: "Edit",
            onClick: () => console.log("Edit prices"), // temp - should open edit prices overrides modal with "Apply on all variants" checked
            icon: <DollarSignIcon />,
          },
          {
            label: "Delete",
            onClick: () => console.log("Remove prices for variant"), // temp - should delete all money amounts for variants from product in price list
            icon: <TrashIcon />,
            variant: "danger",
          },
        ]}
      >
        <div>
          <img src={product.thumbnail} className="w-4 h-5 rounded-base" />
        </div>
        <span className="inter-small-semibold">{product.title}</span>
      </CollapsibleTree.Parent>
      <CollapsibleTree.Content>
        {product.variants.map((variant) => (
          <CollapsibleTree.Leaf
            actions={[
              {
                label: "Edit",
                onClick: () => console.log(`Edit prices for ${variant.id}`), // temp - should open edit prices overrides modal with only this variant selected
                icon: <DollarSignIcon />,
              },
              {
                label: "Delete",
                onClick: () => console.log(`Remove prices for ${variant.id}`), // temp - should delete money amounts in PriceList for this variant
                icon: <TrashIcon />,
                variant: "danger",
              },
            ]}
          >
            <ProductVariantLeaf key={variant.id} {...variant} />
          </CollapsibleTree.Leaf>
        ))}
      </CollapsibleTree.Content>
    </CollapsibleTree>
  )
}

const ProductVariantLeaf = ({ sku, title, prices = [] }: LeafProps) => {
  return (
    <>
      <div className="truncate">
        <span>{title}</span>
        {sku && <span className="text-grey-50 ml-xsmall">(SKU: {sku})</span>}
      </div>
      <div className="flex items-center text-grey-50">
        <div className="text-grey-50 mr-xsmall">
          {prices.length ? (
            <span>{`${prices.length} price${
              prices.length > 1 ? "s" : ""
            }`}</span>
          ) : (
            <span className="inter-small-semibold text-orange-40">
              Add prices
            </span>
          )}
        </div>
      </div>{" "}
    </>
  )
}

export default ProductVariantTree
