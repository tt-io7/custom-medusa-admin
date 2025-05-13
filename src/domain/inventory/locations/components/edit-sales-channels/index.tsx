import { StockLocationExpandedDTO } from "@medusajs/medusa"
import Button from "../../../../../components/fundamentals/button"
import useToggleState from "../../../../../hooks/use-toggle-state"
import SalesChannelsModal from "../../../../products/components/sales-channels-modal"
import medusaRequest from "../../../../../services/request"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"

const EditSalesChannels = ({
  location,
}: {
  location: StockLocationExpandedDTO
}) => {
  const {
    state: showSalesChannelsModal,
    close: closeSalesChannelsModal,
    open: openSalesChannelsModal,
  } = useToggleState()

  const notification = useNotification()

  const addLocationToSalesChannel = async ({ 
    sales_channel_id, 
    location_id 
  }) => {
    try {
      return await medusaRequest("POST", 
        `/admin/stock-locations/${location_id}/sales-channels`, 
        { sales_channel_id }
      )
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
      throw error
    }
  }

  const removeLocationFromSalesChannel = async ({ 
    sales_channel_id, 
    location_id 
  }) => {
    try {
      return await medusaRequest("DELETE", 
        `/admin/stock-locations/${location_id}/sales-channels/${sales_channel_id}`
      )
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
      throw error
    }
  }

  const onSave = async (channels) => {
    const existingChannels = location.sales_channels
    const channelsToRemove =
      existingChannels?.filter(
        (existingChannel) =>
          !channels.some((channel) => existingChannel.id === channel.id)
      ) ?? []
    const channelsToAdd = channels.filter(
      (channel) =>
        existingChannels &&
        !existingChannels.some(
          (existingChannel) => existingChannel.id === channel.id
        )
    )
    
    try {
      await Promise.all([
        ...channelsToRemove.map((channelToRemove) =>
          removeLocationFromSalesChannel({
            sales_channel_id: channelToRemove.id,
            location_id: location.id,
          })
        ),
        ...channelsToAdd.map((channelToAdd) =>
          addLocationToSalesChannel({
            sales_channel_id: channelToAdd.id,
            location_id: location.id,
          })
        ),
      ])
      
      notification("Success", "Sales channels updated successfully", "success")
      closeSalesChannelsModal()
    } catch (error) {
      // Error is already handled in the individual functions
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        size="small"
        type="button"
        onClick={openSalesChannelsModal}
      >
        {location.sales_channels?.length ? "Edit channels" : "Add channels"}
      </Button>
      <SalesChannelsModal
        open={showSalesChannelsModal}
        source={location.sales_channels}
        onClose={closeSalesChannelsModal}
        onSave={onSave}
      />
    </>
  )
}

export default EditSalesChannels
