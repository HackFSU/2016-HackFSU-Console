/**
 * Read the wifi credentials from the input file and then outputs them as a 
 * single-line in JSON object. This is to be copy/pasted into the REST API for
 * Parse.
 */


import java.util.Scanner;
import java.util.ArrayList;
import java.io.IOException;
import java.io.File;
import java.io.PrintWriter;


class WifiCredParser {
	private static final String IN_FILE_NAME = "creds.txt";
	private static final String OUT_FILE_NAME = "creds.json";
	
	private static final String TAG_CREDS = "creds";
	private static final String TAG_USERNAME = "username";
	private static final String TAG_PASSWORD = "password";
	
	private ArrayList<String[]> creds = new ArrayList<String[]>(); //usr + pw
	
	public static void main(String args[]) {
		WifiCredParser parser = new WifiCredParser();
		
		//read
		try {
			parser.readData();
		} catch(IOException e) {
			System.err.println("Error reading from file: " + e.getMessage());
			return;
		}		
		
		//write
		try {
			parser.writeData();
		} catch(IOException e) {
			System.err.println("Error writing to file: " + e.getMessage());
			return;
		}
		
		
		System.out.println(
			"Complete for " + parser.getNumAccounts() + " users!");
		
	}
	
	/**
	 * Reads in data from file. File is to have username + space + password
	 * on each line.
	 * @throws IOException 
	 */
	public void readData() throws IOException {
		Scanner inFile = new Scanner(new File(IN_FILE_NAME));
		String[] user;
		
		//read in each username + password
		while(inFile.hasNext()) {
			user = new String[2];
			user[0] = inFile.next();	//username
			user[1] = inFile.next();	//password
			creds.add(user);
		}
		inFile.close();
	}
	
	/**
	 * Stores users in JSON format
	 * @throws IOException [description]
	 */
	public void writeData() throws IOException {
		PrintWriter outFile = new PrintWriter(new File(OUT_FILE_NAME));
		String output = "";
		
		//start array of JSON objects
		output += "  -d \'{\""+TAG_CREDS+"\":[\n";
		
		//output each user as json object
		for(int i = 0; i < creds.size(); ++i){
			output += "        {\""+TAG_USERNAME+"\":\""+creds.get(i)[0]+"\", ";
			output += "\""+TAG_PASSWORD+"\":\""+creds.get(i)[1]+"\"},\n";
		}
		
		output += "      ]}\' \\\n";
		
		//save to file
		outFile.print(output);
		outFile.close();
	}
	
	public int getNumAccounts() {
		return creds.size();
	}
}