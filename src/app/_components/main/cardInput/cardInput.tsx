"use client";
import { useEffect, useState } from "react";
import { Button, OverlayTrigger } from "react-bootstrap";
import Popover from "react-bootstrap/esm/Popover";
import { type CardType } from "../cards/CardShared";
import Card from "../cards/card";
import IconInput from "../iconInput/IconInput";

export default function CardInput({
  onChange,
  cards,
  label,
  multiple,
  value,
}: {
  onChange?: (text: string[]) => void;
  cards: CardType[];
  label: string;
  multiple: boolean;
  value?: string[];
}) {
  const [cardIds, setCardIds] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (value) setCardIds(value);
  }, [value]);

  return (
    <>
      <OverlayTrigger
        placement={"auto"}
        show={show}
        trigger={"click"}
        rootClose={true}
        //@ts-expect-error bootstrap screwed up
        onHide={() => {
          setShow(false);
        }}
        onToggle={() => {
          setShow(!show);
        }}
        overlay={
          <Popover
            key="imagePopover"
            style={{
              maxWidth: "40rem",
            }}
          >
            <Popover.Header as="h3">
              Cards
              <IconInput onChange={(text) => setFilter(text)} />
              <Button
                style={{
                  paddingLeft: ".25rem",
                  paddingRight: ".25rem",
                  paddingTop: "0rem",
                  paddingBottom: "0rem",
                  position: "absolute",
                  marginTop: "-.25rem",
                  right: ".25rem",
                  top: ".5rem",
                }}
                variant="outline-danger"
                onClick={() => setShow(false)}
              >
                X
              </Button>
            </Popover.Header>
            <Popover.Body
              style={{
                maxHeight: "10rem",
                overflow: "auto",
              }}
              key="imageBody"
            >
              {cards.map((el, i) => {
                const card = cardIds.findIndex((element) => element === el.id);
                if (el.title.includes(filter) && el.id) {
                  return (
                    <Card
                      width="5rem"
                      borderColor={card !== -1 ? "blue" : "black"}
                      cardInput={{ ...el, flipped: true }}
                      key={i}
                      onClick={() => {
                        if (!el.id) return;
                        if (!multiple && cardIds.length) {
                          if (el.id === cardIds[0]) {
                            setCardIds([]);
                            if (onChange) onChange([]);
                          } else {
                            setCardIds([el.id]);
                            if (onChange) onChange([el.id]);
                          }
                          return;
                        }
                        if (card === -1) {
                          setCardIds([...cardIds, el.id]);
                          if (onChange) onChange([...cardIds, el.id]);
                        } else {
                          setCardIds(cardIds.filter((_, i) => card !== i));
                          if (onChange)
                            onChange(cardIds.filter((_, i) => card !== i));
                        }
                      }}
                    />
                  );
                }
              })}
            </Popover.Body>
          </Popover>
        }
      >
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">{label}</label>
          <div
            style={{
              height: "5rem",
            }}
            className="form-control"
          >
            {cardIds.map((id, i) => {
              const card = cards.find((el) => {
                return el.id === id;
              });
              if (!card) return <></>;
              return (
                <Card
                  width="3rem"
                  cardInput={{ ...card, flipped: true }}
                  key={i}
                  onClick={() => ""}
                />
              );
            })}
          </div>
        </div>
      </OverlayTrigger>
    </>
  );
}
