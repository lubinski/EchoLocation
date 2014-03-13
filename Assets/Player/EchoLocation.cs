using UnityEngine;
using System.Collections;

public class EchoLocation : MonoBehaviour {
	public int range;
	public GameObject soundPrefab;
	public float delayFactor;

	// Update is called once per frame
	void Update () {
		if(Input.GetButtonDown("Interact")){
			Ray ray = Camera.main.ScreenPointToRay (Input.mousePosition);
    		RaycastHit hit = new RaycastHit();
    		if (Physics.Raycast (ray, out hit, range)) {
    	    	Debug.DrawLine (ray.origin, hit.point,Color.red,5f);
				Vector3 rayVector = hit.point - ray.origin;

				//use a child object to play click sound for consistency.
				transform.FindChild("ClickEmitter").audio.Play();

				//Instantiate echo to play at target location.
				GameObject echo = Instantiate (soundPrefab) as GameObject;
				echo.transform.position = hit.point;
				echo.audio.PlayDelayed(rayVector.magnitude * delayFactor);
				Destroy (echo,10);
    		}
		}
	}
}
