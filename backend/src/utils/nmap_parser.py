"""Nmap XML parser utility."""
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from src.utils.logger import logger


def parse_nmap_xml(xml_string: str) -> Dict[str, Any]:
    """
    Parse Nmap XML output.
    
    Args:
        xml_string: Raw XML output from nmap
        
    Returns:
        Dictionary with parsed scan results
    """
    try:
        root = ET.fromstring(xml_string)
    except ET.ParseError as e:
        logger.error(f"Failed to parse XML: {e}")
        raise ValueError(f"Invalid XML: {e}")
    
    results = {
        "hosts": [],
        "scan_info": {},
    }
    
    # Parse scan info
    scaninfo = root.find("scaninfo")
    if scaninfo is not None:
        results["scan_info"] = {
            "type": scaninfo.get("type"),
            "protocol": scaninfo.get("protocol"),
            "numservices": scaninfo.get("numservices"),
        }
    
    # Parse hosts
    for host in root.findall("host"):
        host_data = parse_host(host)
        if host_data:
            results["hosts"].append(host_data)
    
    return results


def parse_host(host_element) -> Dict[str, Any]:
    """Parse a single host element."""
    host_data = {
        "status": None,
        "addresses": [],
        "hostnames": [],
        "ports": [],
    }
    
    # Status
    status = host_element.find("status")
    if status is not None:
        host_data["status"] = status.get("state")
    
    # Addresses
    for address in host_element.findall("address"):
        host_data["addresses"].append({
            "addr": address.get("addr"),
            "addrtype": address.get("addrtype"),
        })
    
    # Hostnames
    hostnames = host_element.find("hostnames")
    if hostnames is not None:
        for hostname in hostnames.findall("hostname"):
            host_data["hostnames"].append({
                "name": hostname.get("name"),
                "type": hostname.get("type"),
            })
    
    # Ports
    ports = host_element.find("ports")
    if ports is not None:
        for port in ports.findall("port"):
            port_data = parse_port(port)
            if port_data:
                host_data["ports"].append(port_data)
    
    return host_data


def parse_port(port_element) -> Dict[str, Any]:
    """Parse a single port element."""
    port_data = {
        "port": int(port_element.get("portid", 0)),
        "protocol": port_element.get("protocol", "tcp"),
        "state": None,
        "service": None,
        "version": None,
    }
    
    # State
    state = port_element.find("state")
    if state is not None:
        port_data["state"] = state.get("state")
    
    # Service
    service = port_element.find("service")
    if service is not None:
        port_data["service"] = service.get("name")
        version_parts = []
        
        if service.get("product"):
            version_parts.append(service.get("product"))
        if service.get("version"):
            version_parts.append(service.get("version"))
        
        if version_parts:
            port_data["version"] = " ".join(version_parts)
    
    return port_data


def format_findings(parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Format parsed nmap data into finding objects.
    
    Args:
        parsed_data: Parsed XML data from parse_nmap_xml
        
    Returns:
        List of finding dictionaries
    """
    findings = []
    
    for host in parsed_data.get("hosts", []):
        for port in host.get("ports", []):
            if port["state"] == "open":
                finding = {
                    "port": port["port"],
                    "protocol": port["protocol"],
                    "state": port["state"],
                    "service": port["service"],
                    "version": port["version"],
                }
                findings.append(finding)
    
    logger.info(f"Formatted {len(findings)} findings")
    return findings
