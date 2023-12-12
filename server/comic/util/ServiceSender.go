package util

import (
	"context"
	"encoding/json"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/redis/go-redis/v9"
)

// send the message through the redis channel
func ServiceSender[T any, ht any](redis *redis.Client, message LocalTypes.ServiceRequest, listenRespond bool) (*LocalTypes.ServiceReturnData[T, ht], error) {
	ctx := context.Background()
	channel := message.Url
	message_byte, err := json.Marshal(message)
	if err != nil {
		return nil, err
	}
	err = redis.Publish(ctx, channel, string(message_byte)).Err()
	if err != nil {
		return nil, err
	}
	if listenRespond {
		sub := redis.Subscribe(ctx, channel)
		defer sub.Close()
		for {
			data, err := sub.ReceiveMessage(ctx)
			if err != nil {
				return nil, err
			}
			var result LocalTypes.ServiceReturnData[T, ht]
			err = json.Unmarshal([]byte(data.Payload), &result)
			if err != nil {
				return nil, err
			}
			if result.ID == message.ID && result.Url == message.From && result.From == message.Url {
				return &result, nil
			}
		}

	}
	return nil, nil
}
