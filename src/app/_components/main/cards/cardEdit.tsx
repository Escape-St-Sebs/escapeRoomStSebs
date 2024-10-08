"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Form, OverlayTrigger, Popover } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Draggable from "react-draggable";
import styles from "./cards.module.css";
import type { CardType } from "./CardShared";
import { siteOptionsContext } from "~/app/(internal)/layoutStuff";

interface CardProps {
  cardInput: CardType;
  onClick?: () => void;
  onChange: (e: CardType) => void;
}

function Text({
  object,
  i,
  test,
  currentCard,
  onChange,
  setCurrentCard,
}: {
  object: {
    fontSize: number;
    x: number;
    y: number;
    text: string;
    color?: string;
  };
  bodyRef: React.MutableRefObject<null>;
  onChange: (e: CardType) => void;
  test: number;
  currentCard: CardType;
  setCurrentCard: React.Dispatch<React.SetStateAction<CardType>>;
  i: number;
}) {
  const ref = React.useRef<null>(null);
  const [showTextPopup, setShowTextPopup] = useState(false);
  const text = currentCard.texts[i];
  if (text) {
    return (
      <OverlayTrigger
        placement={"auto"}
        show={showTextPopup}
        trigger={"click"}
        rootClose={true}
        //@ts-expect-error bootstrap screwed up
        onHide={() => {
          setShowTextPopup(false);
        }}
        onToggle={() => {
          setShowTextPopup(!showTextPopup);
        }}
        overlay={
          <Popover key={"textPopover" + i}>
            <Popover.Header key={"textHeader" + i} as="h3">
              Text settings
              <Button
                style={{
                  paddingLeft: ".25rem",
                  paddingRight: ".25rem",
                  paddingTop: "0rem",
                  paddingBottom: "0rem",
                  float: "right",
                  marginTop: "-.25rem",
                }}
                variant="outline-danger"
                onClick={() => setShowTextPopup(false)}
              >
                X
              </Button>
            </Popover.Header>
            <Popover.Body key={"textBody" + i}>
              <Form.Group key={"textGroupSize" + i}>
                <Form.Label key={"textGroupLabelSize" + i}>
                  Fontsize in zorps
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  step={0.1}
                  key={"textControlSize" + i}
                  value={text.fontSize ?? 1}
                  onChange={(e) => {
                    setCurrentCard({
                      ...currentCard,
                      texts: currentCard.texts.map((el, j) => {
                        if (i === j) {
                          return {
                            ...text,
                            fontSize: parseFloat(e.target.value) ?? 0,
                          };
                        }
                        return el;
                      }),
                    });
                  }}
                  onBlur={(e) => {
                    if (onChange)
                      onChange({
                        ...currentCard,
                        texts: currentCard.texts.map((el, j) => {
                          if (i === j) {
                            return {
                              ...text,
                              fontSize: parseFloat(e.target.value) ?? 0,
                            };
                          }
                          return el;
                        }),
                      });
                  }}
                />
              </Form.Group>
              <Form.Group key={"textGroupText" + i}>
                <Form.Label key={"textGroupLabelText" + i}>Text</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  min={0}
                  step={0.1}
                  key={"textControlText" + i}
                  value={text.text ?? ""}
                  placeholder="Lorem Ipsum"
                  onBlur={(e) => {
                    if (onChange)
                      onChange({
                        ...currentCard,
                        texts: currentCard.texts.map((el, j) => {
                          if (i === j) {
                            return {
                              ...text,
                              text: e.target.value ?? "",
                            };
                          }
                          return el;
                        }),
                      });
                    // setCurrentCard({
                    //   ...currentCard,
                    //   texts: currentCard.texts.map((el, j) => {
                    //     if (i === j) {
                    //       return {
                    //         ...text,
                    //         text: e.target.value ?? "",
                    //       };
                    //     }
                    //     return el;
                    //   }),
                    // });
                  }}
                  onChange={(e) => {
                    setCurrentCard({
                      ...currentCard,
                      texts: currentCard.texts.map((el, j) => {
                        if (i === j) {
                          return {
                            ...text,
                            text: e.target.value ?? "",
                          };
                        }
                        return el;
                      }),
                    });
                  }}
                />
              </Form.Group>
              <Form.Group key={"textGroupColor" + i}>
                <Form.Label key={"textGroupLabelColor" + i}>Color</Form.Label>
                <Form.Control
                  type="color"
                  key={"textControlColor" + i}
                  value={text.color ?? "black"}
                  onChange={(e) => {
                    if (onChange)
                      onChange({
                        ...currentCard,
                        texts: currentCard.texts.map((el, j) => {
                          if (i === j) {
                            return {
                              ...text,
                              color: e.target.value,
                            };
                          }
                          return el;
                        }),
                      });
                  }}
                />
              </Form.Group>
              <Button
                variant="danger"
                onClick={() => {
                  if (onChange)
                    onChange({
                      ...currentCard,
                      texts: currentCard.texts.filter((el, j) => {
                        return j !== i;
                      }),
                    });
                }}
              >
                Delete
              </Button>
            </Popover.Body>
          </Popover>
        }
      >
        <Draggable
          nodeRef={ref}
          position={{
            x: (text.x ?? 0) * test * 0.2,
            y: (text.y ?? 0) * test * 0.2,
          }}
          bounds="parent"
          onDrag={(e, position) => {
            const { x, y } = position;

            setCurrentCard({
              ...currentCard,
              texts: currentCard.texts.map((el, j) => {
                if (i === j) {
                  return {
                    ...text,
                    x: x / test / 0.2,
                    y: y / test / 0.2,
                  };
                }
                return el;
              }),
            });
          }}
          onStop={(e, position) => {
            const { x, y } = position;
            if (onChange)
              onChange({
                ...currentCard,
                texts: currentCard.texts.map((el, j) => {
                  if (i === j) {
                    return {
                      ...text,
                      x: x / test / 0.2,
                      y: y / test / 0.2,
                    };
                  }
                  return el;
                }),
              });
          }}
        >
          <div
            style={{
              display: "block",
              position: "absolute",
              width: "fit-content",
              blockSize: "fit-content",
              float: "none",
            }}
            ref={ref}
          >
            <p
              style={{
                fontSize: object.fontSize * test * 0.1 + "px",
                userSelect: "none",
                whiteSpace: "pre-line",
                position: "relative",
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                color: object.color || "rgb(0, 0, 0)",
                margin: 0,
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowTextPopup(!showTextPopup);
              }}
              key={i + "cardText" + "text"}
            >
              {object.text || "Lorem Ipsum"}
            </p>
          </div>
        </Draggable>
      </OverlayTrigger>
    );
  }
}

export default function Cards({
  onChange,
  cardInput,
  //   parentWidth,
}: CardProps) {
  const siteOptions = useContext(siteOptionsContext);
  const [size] = useState("10rem");
  const [expanded] = useState(false);
  const card = useRef<HTMLDivElement | null>(null);
  //   const [rem, setRem] = useState(parentWidth / 160);
  const [test, setTest] = useState(100 / 160);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const nodeRef = React.useRef<null>(null);
  const bodyRef = React.useRef<null>(null);
  const [currentCard, setCurrentCard] = useState<CardType>(cardInput);

  useEffect(() => {
    setCurrentCard(cardInput);
  }, [cardInput]);

  useEffect(() => {
    if (expanded) {
      card.current?.scrollIntoView({ behavior: "smooth" });
    }
    setTest(card.current?.getBoundingClientRect().width ?? 0);
  }, [expanded]);
  return (
    <Card
      className={styles.cardBase}
      style={{
        width: size,
        backgroundSize: size,
        backgroundImage: `url(${siteOptions.card})`,
      }}
      ref={bodyRef}
    >
      <Card.Body
        ref={card}
        className={styles.cardBody}
        style={{
          padding: 0.03 * test + "px",
        }}
      >
        <h1
          style={{
            fontSize: 0.2 * test + "px",
            gridArea: "a",
            margin: 0,
            color: "black",
          }}
          className="text-center"
        >
          {currentCard.title || "___"}
        </h1>
        <div style={{ gridArea: "b", position: "relative", overflow: "clip" }}>
          {currentCard.texts.map((object, i) => (
            <Text
              bodyRef={bodyRef}
              onChange={onChange}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
              test={test}
              key={"textEdit" + i}
              object={object}
              i={i}
            />
          ))}

          {currentCard.image ? (
            <OverlayTrigger
              placement={"auto"}
              trigger={"click"}
              rootClose={true}
              //@ts-expect-error bootstrap screwed up
              onHide={() => {
                setShowImagePopup(false);
              }}
              onToggle={() => {
                setShowImagePopup(!showImagePopup);
              }}
              show={showImagePopup}
              overlay={
                <Popover key="imagePopover">
                  <Popover.Header as="h3">
                    Image Size
                    <Button
                      style={{
                        paddingLeft: ".25rem",
                        paddingRight: ".25rem",
                        paddingTop: "0rem",
                        paddingBottom: "0rem",
                        float: "right",
                        marginTop: "-.25rem",
                      }}
                      variant="outline-danger"
                      onClick={() => setShowImagePopup(false)}
                    >
                      X
                    </Button>
                  </Popover.Header>
                  <Popover.Body key="imageBody">
                    <Form.Group key="imageGroupWidth">
                      <Form.Label key="imageLabelWidth">
                        Width in Goobles
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        step={0.1}
                        key="imageControlWidth"
                        value={currentCard.image.width ?? 0}
                        onChange={(e) => {
                          if (currentCard.image) {
                            setCurrentCard({
                              ...currentCard,
                              image: {
                                ...currentCard.image,
                                width: parseFloat(e.currentTarget.value) ?? 0,
                              },
                            });
                          }
                        }}
                        onBlur={(e) => {
                          if (currentCard.image) {
                            if (onChange)
                              onChange({
                                ...currentCard,
                                image: {
                                  ...currentCard.image,
                                  width: parseFloat(e.currentTarget.value) ?? 0,
                                },
                              });
                          }
                        }}
                      />
                    </Form.Group>
                    <Form.Group key="imageGroupHeight">
                      <Form.Label key="imageLabelHeight">
                        Height in Goobles
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        step={0.1}
                        key="imageControlHeight"
                        value={currentCard.image.height ?? ""}
                        onChange={(e) => {
                          if (currentCard.image) {
                            setCurrentCard({
                              ...currentCard,
                              image: {
                                ...currentCard.image,
                                height: parseFloat(e.currentTarget.value) ?? 0,
                              },
                            });
                          }
                        }}
                        onBlur={(e) => {
                          if (currentCard.image) {
                            if (onChange)
                              onChange({
                                ...currentCard,
                                image: {
                                  ...currentCard.image,
                                  height:
                                    parseFloat(e.currentTarget.value) ?? 0,
                                },
                              });
                          }
                        }}
                      />
                    </Form.Group>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (onChange)
                          onChange({
                            ...currentCard,
                            image: null,
                          });
                      }}
                    >
                      Delete
                    </Button>
                  </Popover.Body>
                </Popover>
              }
            >
              <Draggable
                nodeRef={nodeRef}
                position={{
                  x: (currentCard.image?.x ?? 0) * test * 0.2,
                  y: (currentCard.image?.y ?? 0) * test * 0.2,
                }}
                bounds="parent"
                onStop={(e, position) => {
                  const { x, y } = position;
                  if (currentCard.image) {
                    if (onChange)
                      onChange({
                        ...currentCard,
                        image: {
                          ...currentCard.image,
                          x: x / test / 0.2,
                          y: y / test / 0.2,
                        },
                      });
                  }
                }}
                onDrag={(e, position) => {
                  const { x, y } = position;
                  if (currentCard.image) {
                    setCurrentCard({
                      ...currentCard,
                      image: {
                        ...currentCard.image,
                        x: x / test / 0.2,
                        y: y / test / 0.2,
                      },
                    });
                  }
                }}
              >
                <div
                  style={{
                    display: "block",
                    position: "relative",
                    width: "fit-content",
                    blockSize: "fit-content",
                    float: "none",
                  }}
                  ref={nodeRef}
                >
                  <Image
                    alt="image"
                    src={currentCard.image.href ?? ""}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowImagePopup(!showImagePopup);
                      return false;
                    }}
                    draggable="false"
                    onClick={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    style={{
                      width: currentCard.image.width * test * 0.2 + "px",
                      height: currentCard.image.height
                        ? currentCard.image.height * test * 0.2 + "px"
                        : "auto",
                      userSelect: "none",
                    }}
                  />
                </div>
              </Draggable>
            </OverlayTrigger>
          ) : (
            ""
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
