import { useState } from "react"
import medusaRequest from "../services/request"
import useNotification from "./use-notification"
import { getErrorMessage } from "../utils/error-messages"

/**
 * Custom hook to handle all stock location related operations
 * This replaces all the missing Medusa React hooks
 */
export const useStockLocations = () => {
  const [isLoading, setIsLoading] = useState(false)
  const notification = useNotification()

  const fetchStockLocations = async (query = {}) => {
    setIsLoading(true)
    try {
      const { stock_locations } = await medusaRequest("GET", "/admin/stock-locations", query)
      setIsLoading(false)
      return stock_locations
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
      setIsLoading(false)
      return []
    }
  }

  const createStockLocation = async (data) => {
    setIsLoading(true)
    try {
      const response = await medusaRequest("POST", "/admin/stock-locations", data)
      setIsLoading(false)
      notification("Success", "Location created successfully", "success")
      return response.stock_location
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
      setIsLoading(false)
      throw error
    }
  }

  const updateStockLocation = async (id, data) => {
    setIsLoading(true)
    try {
      const response = await medusaRequest("POST", `/admin/stock-locations/${id}`, data)
      setIsLoading(false)
      notification("Success", "Location updated successfully", "success")
      return response.stock_location
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
      setIsLoading(false)
      throw error
    }
  }

  const deleteStockLocation = async (id) => {
    setIsLoading(true)
    try {
      await medusaRequest("DELETE", `/admin/stock-locations/${id}`)
      setIsLoading(false)
      notification("Success", "Location deleted successfully", "success")
      return true
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
      setIsLoading(false)
      throw error
    }
  }

  const addLocationToSalesChannel = async (locationId, salesChannelId) => {
    try {
      return await medusaRequest("POST", 
        `/admin/stock-locations/${locationId}/sales-channels`, 
        { sales_channel_id: salesChannelId }
      )
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
      throw error
    }
  }

  const removeLocationFromSalesChannel = async (locationId, salesChannelId) => {
    try {
      return await medusaRequest("DELETE", 
        `/admin/stock-locations/${locationId}/sales-channels/${salesChannelId}`
      )
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
      throw error
    }
  }

  return {
    isLoading,
    fetchStockLocations,
    createStockLocation,
    updateStockLocation,
    deleteStockLocation,
    addLocationToSalesChannel,
    removeLocationFromSalesChannel
  }
}

export default useStockLocations 