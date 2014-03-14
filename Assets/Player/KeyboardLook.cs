using UnityEngine;
using System.Collections;

public class KeyboardLook : MonoBehaviour {

	// Use this for initialization
	void Start () {
		Screen.showCursor = false;   
		Screen.lockCursor = true;

	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetButtonDown ("LookLeft")) {
			transform.Rotate(0,-90, 0);
		}
		if (Input.GetButtonDown ("LookRight")) {
			transform.Rotate(0,90, 0);
		}
	}
}
