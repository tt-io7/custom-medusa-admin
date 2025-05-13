// Temporary file to check available hooks
import * as medusaReact from "medusa-react"

console.log("Available hooks in medusa-react:")
console.log(Object.keys(medusaReact).filter(hook => 
  hook.includes("Location") || 
  hook.includes("location") || 
  hook.includes("Stock") || 
  hook.includes("stock") ||
  hook.includes("Inventory") ||
  hook.includes("inventory")
).join("\n")) 