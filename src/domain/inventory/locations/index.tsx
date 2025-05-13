import { useState, useEffect } from "react"
import Fade from "../../../components/atoms/fade-wrapper"
import Spinner from "../../../components/atoms/spinner"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import useToggleState from "../../../hooks/use-toggle-state"
import InventoryPageTableHeader from "../header"
import NewLocation from "./new"
import LocationCard from "./components/location-card"
import medusaRequest from "../../../services/request"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"

const Locations = () => {
  const {
    state: createLocationState,
    close: closeLocationCreate,
    open: openLocationCreate,
  } = useToggleState()

  const [isLoading, setIsLoading] = useState(true)
  const [stockLocations, setStockLocations] = useState([])
  const notification = useNotification()

  const fetchStockLocations = async () => {
    setIsLoading(true)
    try {
      const { stock_locations } = await medusaRequest("GET", "/admin/stock-locations", {
        expand: "address,sales_channels"
      })
      setStockLocations(stock_locations)
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStockLocations()
  }, [])

  const Actions = (
    <Button variant="secondary" size="small" onClick={openLocationCreate}>
      <PlusIcon size={20} />
      Add location
    </Button>
  )

  return (
    <>
      <div className="flex flex-col h-full grow">
        <div className="flex flex-col w-full grow">
          <BodyCard
            customHeader={<InventoryPageTableHeader activeView="locations" />}
            className="min-h-[85px] h-[85px]"
            customActionable={Actions}
          />
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Spinner variant="secondary" />
            </div>
          ) : (
            <div>
              {stockLocations?.map((stockLocation) => (
                <LocationCard key={stockLocation.id} location={stockLocation} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Fade isVisible={createLocationState} isFullScreen={true}>
        <NewLocation onClose={() => {
          closeLocationCreate()
          fetchStockLocations()
        }} />
      </Fade>
    </>
  )
}

export default Locations
