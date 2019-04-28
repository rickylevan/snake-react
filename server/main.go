package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var lyrics []string

func reader(conn *websocket.Conn) {
	// write random post malone psycho lyrics to client
	go func() {
		for {
			idx := rand.Intn(len(lyrics))
			conn.WriteMessage(1, []byte(lyrics[idx]))
			time.Sleep(1 * time.Second)
		}

	}()
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		log.Println(string(p))

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Home Page")
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	// helps avoid CORS error
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	log.Println("Client Successfully Connected...")

	reader(ws)
}

func setupRoutes() {
	http.HandleFunc("/", homePage)
	http.HandleFunc("/ws", wsEndpoint)
}

func psychoLulz() {
	lyricsBytes, err := ioutil.ReadFile("psycho.txt")
	if err != nil {
		log.Fatal(err)
	}

	lyrics = strings.Split(string(lyricsBytes), "\n")
}

func main() {
	fmt.Println("Go Websockets")
	setupRoutes()
	psychoLulz()
	log.Fatal(http.ListenAndServe(":8080", nil))
}
