using UnityEngine;
using System.Collections;

public class Intro : MonoBehaviour {
	float wait = 10f;
	bool stop;
	public GameObject player;
	// Use this for initialization
	void Start () {
		wait = wait + Time.time;
	}
	void Update()
	{
		if (Time.time > wait && !stop) {
			player.transform.position = new Vector3(1.88707f,1.625f,-9.59f);
			stop = true;
		}
	}
}
