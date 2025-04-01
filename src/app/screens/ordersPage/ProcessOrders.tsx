import React from "react";
import { Stack, Box } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

export default function ProcessOrders() {
  const orders = [1, 2];

  return (
    <TabPanel value="2">
      <Stack>
        {/* number of orders */}
        {orders.map((ele, index) => {
          return (
            <Box key={index} className="order-main-box">
              <Box className="order-box-scroll">
                {/* number of items in each order */}
                {[1, 2, 3].map((ele2, index2) => {
                  return (
                    <Box key={index2} className="orders-name-price">
                      <Stack className="order-dish-class">
                        <img src="img/lavash.webp" className="order-dish-img" />
                        <p className="title-dish">Lavash</p>
                      </Stack>
                      <Stack className="price-box">
                        <p>$10</p>
                        <img src="/icons/close.svg" />
                        <p>2</p>
                        <img src="/icons/pause.svg" />
                        <p style={{ marginLeft: "15px" }}>$20</p>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>

              <Box className="total-price-box">
                <Box className="box-total">
                  <p>Product price</p>
                  <p>$60</p>
                  <img src="/icons/plus.svg" style={{ marginLeft: "20px" }} />
                  <p> Delivery cost</p>
                  <p>$5</p>
                  <img src="/icons/pause.svg" style={{ marginLeft: "20px" }} />
                  <p>Total</p>
                  <p>$65</p>
                </Box>
                <p className="data-compl">
                  {moment().format("YY-MM-DD HH:mm")}
                </p>
                <Button variant="contained" className="verify-button">
                  Verify to fulfill
                </Button>
              </Box>
            </Box>
          );
        })}

        {orders.length <= 0 && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img
              src="/icons/noimage-list.svg"
              style={{ width: 300, height: 300 }}
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}
