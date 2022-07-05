package youtubedl

import (
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"

	"github.com/kkdai/youtube/v2"
)

func YtDownloader(videoID string, ToMp3 bool) error {
	client := youtube.Client{}

	video, err := client.GetVideo(videoID)
	if err != nil {
		return err
	}

	formats := video.Formats.WithAudioChannels() // only get videos with audio
	stream, _, err := client.GetStream(video, &formats[0])
	if err != nil {
		return err
	}

	VideoPath := fmt.Sprintf("%s/%s", getVideoDirPath(), videoID)

	file, err := os.Create(VideoPath + ".mp4")
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.Copy(file, stream)
	if err != nil {
		return err
	}

	if ToMp3 {
		err = ExecCmd("ffmpeg", "-i", VideoPath+".mp4", VideoPath+".mp3")
		if err != nil {
			log.Println(err)
			return err
		}
	}

	return nil
}

func ExecCmd(name string, args ...string) error {
	c := exec.Command(name, args...)

	err := c.Start()
	if err != nil {
		return err
	}

	return c.Wait()
}

func getVideoDirPath() string {
	if os.Getenv("APP_MODE") == "prod" {
		return "."
	}
	return "../../videos"
}
