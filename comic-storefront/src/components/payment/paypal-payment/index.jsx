import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useMemo, useState } from "react";

import { navigate } from "gatsby"
import { useCart } from "../../../hooks/use-cart"
import { useMedusa } from "../../../hooks/use-medusa";

const paypalClientId = process.env.GATSBY_PAYPAL_CLIENT_ID || ""
 const PaypalPayment = () => {
   const { 
     cart,
     actions: { completeCart, setPaymentSession },
   } = useCart()
   const [errorMessage, setErrorMessage] = useState(undefined)
   const [processing, setProcessing] = useState(false)
   const client = useMedusa()
   const paypalSession = useMemo(() => {
     if (cart.payment_sessions) {
       return cart.payment_sessions.find(s => s.provider_id === "paypal")
     }
     return null
   }, [cart.payment_sessions])
   if (!paypalSession) {
     return null
   }
   const completeOrder = async (authorizationOrder) => {
     const cart = await setPaymentSession("paypal")
     if (!cart) {
       setProcessing(false)
       return
     }
     await client.carts.updatePaymentSession(cart.id, "paypal", {
       data: {
         data: {
           ...authorizationOrder
         }
       }
     });
     const order = await completeCart(cart.id)
     if (!order || order.object !== "order") {
       setProcessing(false)
       return
     }
     setProcessing(false)
     navigate("/order-confirmed", { state: { order } })
   }
   const handlePayment = (data, actions) => {
     actions.order.authorize().then((authorization) => {
       if (authorization.status !== 'COMPLETED') {
         setErrorMessage(`An error occurred, status: ${authorization.status}`);
         setProcessing(false);
         return;
       }
       completeOrder(authorization)
     })
   }
   return (
     <PayPalScriptProvider options={{ 
       "client-id": paypalClientId,
       "currency": cart.region.currency_code.toUpperCase(),
       "intent": "authorize"
     }}>
         {errorMessage && (
           <span className="text-rose-500 mt-4">{errorMessage}</span>
         )}
         <PayPalButtons 
           style={{ layout: "horizontal" }}
           onApprove={handlePayment}
           disabled={processing}
         />
     </PayPalScriptProvider>
   )
 }
 export default PaypalPayment;