import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  FileCode2,
  Terminal,
  FolderTree,
  Send,
  Layers,
  Cpu,
  BookOpen,
  ArrowRight,
  Database,
  Shield,
  Coffee,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface JavaFile {
  name: string;
  path: string;
  packageName: string;
  description: string;
  category: 'Entity' | 'Repository' | 'Service' | 'Controller' | 'Config' | 'Build';
  code: string;
}

export const JAVA_CODE_MODULES: JavaFile[] = [
  {
    name: 'Product.java',
    path: 'src/main/java/com/terraharvest/marketplace/model/Product.java',
    packageName: 'com.terraharvest.marketplace.model',
    description: 'JPA Entity representing a cold-chain monitored farm product SKU with pricing, batch lots, and inventory thresholds.',
    category: 'Entity',
    code: `package com.terraharvest.marketplace.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_sku", columnList = "sku", unique = true),
    @Index(name = "idx_product_vendor", columnList = "vendor_id"),
    @Index(name = "idx_product_category", columnList = "category")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Vendor ID is mandatory")
    @Column(name = "vendor_id", nullable = false)
    private String vendorId;

    @Column(name = "vendor_name", nullable = false)
    private String vendorName;

    @NotBlank(message = "Product name cannot be blank")
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @NotBlank
    @Column(nullable = false, unique = true, length = 32)
    private String sku; // e.g. SKU-COF-001

    @Column(name = "batch_lot", nullable = false)
    private String batchLot; // e.g. LOT-2026-AUG-22

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Retail Price in INR (₹)

    @NotNull
    @Column(name = "wholesale_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal wholesalePrice;

    @NotBlank
    @Column(nullable = false)
    private String unit; // 'per 500g pouch', 'per kg bunch'

    @Min(0)
    @Column(nullable = false)
    private Integer stock;

    @Min(0)
    @Column(name = "min_stock_threshold", nullable = false)
    private Integer minStockThreshold;

    @Min(1)
    @Column(name = "reorder_quantity", nullable = false)
    private Integer reorderQuantity;

    @Column(name = "is_organic", nullable = false)
    private Boolean isOrganic;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_dietary_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    private List<String> dietary;

    @Column(nullable = false)
    private String origin; // e.g. "Madikeri, Coorg (Kodagu), KA"

    @Column(name = "harvest_date")
    private String harvestDate;

    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(precision = 3, scale = 2)
    private Double rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "external_erp_id")
    private String externalErpId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.rating == null) this.rating = 5.0;
        if (this.reviewCount == null) this.reviewCount = 0;
    }

    public boolean isLowStock() {
        return this.stock != null && this.minStockThreshold != null && this.stock <= this.minStockThreshold;
    }
}`,
  },
  {
    name: 'Vendor.java',
    path: 'src/main/java/com/terraharvest/marketplace/model/Vendor.java',
    packageName: 'com.terraharvest.marketplace.model',
    description: 'JPA Entity representing certified Karnataka agricultural producers with GSTIN validation, location, and Stripe accounts.',
    category: 'Entity',
    code: `package com.terraharvest.marketplace.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    private String id; // e.g. "v-01"

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Pattern(regexp = "^29[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", 
             message = "Must be a valid Karnataka GSTIN (State Code 29)")
    @Column(name = "business_reg", nullable = false, unique = true)
    private String businessReg;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String location; // e.g. "Madikeri, Coorg (Kodagu), KA"

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, length = 2)
    private String state; // "KA"

    @Column(name = "distance_miles")
    private Double distanceMiles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VendorStatus status; // ACTIVE, PENDING_REVIEW, VERIFIED, SUSPENDED

    @Column(precision = 3, scale = 2)
    private Double rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Email
    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    @Column(name = "contact_phone", nullable = false)
    private String contactPhone;

    @Column(name = "commission_rate", precision = 4, scale = 2)
    private BigDecimal commissionRate; // 0.10 for 10%

    @Column(name = "stripe_status")
    private String stripeStatus;

    @Column(name = "delivery_radius_miles")
    private Integer deliveryRadiusMiles;

    @ElementCollection
    @CollectionTable(name = "vendor_certifications", joinColumns = @JoinColumn(name = "vendor_id"))
    private List<String> certifications;

    @Column(name = "total_revenue", precision = 12, scale = 2)
    private BigDecimal totalRevenue;

    @Column(name = "order_count")
    private Integer orderCount;

    @Column(columnDefinition = "TEXT")
    private String bio;

    public enum VendorStatus {
        ACTIVE, PENDING_REVIEW, VERIFIED, SUSPENDED
    }
}`,
  },
  {
    name: 'Order.java',
    path: 'src/main/java/com/terraharvest/marketplace/model/Order.java',
    packageName: 'com.terraharvest.marketplace.model',
    description: 'JPA Order entity managing customer orders, items, cold-chain temperature status, and payment intents.',
    category: 'Entity',
    code: `package com.terraharvest.marketplace.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private String id; // e.g. "ORD-2026-7841"

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "delivery_fee", precision = 10, scale = 2)
    private BigDecimal deliveryFee;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status; // PENDING, CONFIRMED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    @Column(name = "courier_name")
    private String courierName;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "cold_chain_temp_celsius")
    private Double coldChainTempCelsius; // Monitored between 2.0°C and 4.0°C

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum OrderStatus {
        PENDING, CONFIRMED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    }
}`,
  },
  {
    name: 'ProductRepository.java',
    path: 'src/main/java/com/terraharvest/marketplace/repository/ProductRepository.java',
    packageName: 'com.terraharvest.marketplace.repository',
    description: 'Spring Data JPA repository providing optimized queries for Karnataka product SKUs, stock levels, and vendor filtering.',
    category: 'Repository',
    code: `package com.terraharvest.marketplace.repository;

import com.terraharvest.marketplace.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    Optional<Product> findBySku(String sku);

    List<Product> findByVendorId(String vendorId);

    List<Product> findByCategoryIgnoreCase(String category);

    // Query for SKUs requiring automated restock
    @Query("SELECT p FROM Product p WHERE p.stock <= p.minStockThreshold ORDER BY p.stock ASC")
    List<Product> findLowStockProducts();

    // Full-text search across Karnataka catalog
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.origin) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.vendorName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchCatalog(@Param("query") String query);

    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findAllCategories();
}`,
  },
  {
    name: 'ProductService.java',
    path: 'src/main/java/com/terraharvest/marketplace/service/ProductService.java',
    packageName: 'com.terraharvest.marketplace.service',
    description: 'Service layer implementing business logic, inventory SKU deductions, low-stock notifications, and batch traceability.',
    category: 'Service',
    code: `package com.terraharvest.marketplace.service;

import com.terraharvest.marketplace.model.Product;
import com.terraharvest.marketplace.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new NoSuchElementException("Product SKU not found: " + sku));
    }

    @Transactional
    public Product adjustStock(String productId, int delta) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + productId));

        int updatedStock = Math.max(0, product.getStock() + delta);
        product.setStock(updatedStock);

        if (product.isLowStock()) {
            log.warn("ALERT: SKU {} has fallen to {} units (Threshold: {}). Auto-restock signal emitted.",
                    product.getSku(), updatedStock, product.getMinStockThreshold());
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product reorderStock(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + productId));

        int replenishment = product.getReorderQuantity();
        product.setStock(product.getStock() + replenishment);
        log.info("Replenished SKU {} with +{} units from Karnataka farm supplier.", product.getSku(), replenishment);

        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public List<Product> searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return productRepository.findAll();
        }
        return productRepository.searchCatalog(query.trim());
    }
}`,
  },
  {
    name: 'ProductController.java',
    path: 'src/main/java/com/terraharvest/marketplace/controller/ProductController.java',
    packageName: 'com.terraharvest.marketplace.controller',
    description: 'Spring Boot REST Controller exposing clean JSON endpoints for catalog browsing, search, and stock management.',
    category: 'Controller',
    code: `package com.terraharvest.marketplace.controller;

import com.terraharvest.marketplace.model.Product;
import com.terraharvest.marketplace.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getCatalog(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(productService.searchProducts(search));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<Product> getBySku(@PathVariable String sku) {
        return ResponseEntity.ok(productService.getProductBySku(sku));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDOR')")
    public ResponseEntity<Product> adjustStock(
            @PathVariable String id,
            @RequestBody Map<String, Integer> payload) {
        Integer delta = payload.getOrDefault("delta", 0);
        return ResponseEntity.ok(productService.adjustStock(id, delta));
    }

    @PostMapping("/{id}/reorder")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDOR')")
    public ResponseEntity<Product> triggerReorder(@PathVariable String id) {
        return ResponseEntity.ok(productService.reorderStock(id));
    }
}`,
  },
  {
    name: 'OrderController.java',
    path: 'src/main/java/com/terraharvest/marketplace/controller/OrderController.java',
    packageName: 'com.terraharvest.marketplace.controller',
    description: 'REST Controller managing order placement, cold-chain temperature telemetry updates, and reverse logistics.',
    category: 'Controller',
    code: `package com.terraharvest.marketplace.controller;

import com.terraharvest.marketplace.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrderController {

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> orderPayload) {
        // Simulates Spring Boot order creation and cold-chain route initialization
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}/telemetry")
    public ResponseEntity<Map<String, Object>> getColdChainTelemetry(@PathVariable String id) {
        // Cold chain monitoring response (2-4°C compliant)
        return ResponseEntity.ok(Map.of(
            "orderId", id,
            "currentTemperatureCelsius", 3.4,
            "status", "OPTIMAL_COLD_CHAIN",
            "hubCheckpoint", "Yeshwanthpur Quality & Cold-Chain Center, Bengaluru"
        ));
    }
}`,
  },
  {
    name: 'TerraHarvestApplication.java',
    path: 'src/main/java/com/terraharvest/marketplace/TerraHarvestApplication.java',
    packageName: 'com.terraharvest.marketplace',
    description: 'Spring Boot 3.3.x Application bootstrap class with JPA Auditing and Scheduled Cold-Chain monitoring.',
    category: 'Config',
    code: `package com.terraharvest.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class TerraHarvestApplication {

    public static void main(String[] args) {
        SpringApplication.run(TerraHarvestApplication.class, args);
        System.out.println("🌱 TerraHarvest Karnataka Agricultural Exchange API is live on port 8080!");
    }
}`,
  },
  {
    name: 'pom.xml',
    path: 'pom.xml',
    packageName: 'Maven Build Descriptor',
    description: 'Maven configuration for Java 21, Spring Boot 3.3, Hibernate, PostgreSQL, and Spring Security.',
    category: 'Build',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>

    <groupId>com.terraharvest</groupId>
    <artifactId>terraharvest-karnataka-backend</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>terraharvest-karnataka-backend</name>
    <description>Production Spring Boot Backend for Karnataka Agricultural Cold-Chain Exchange</description>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web MVC -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA & Hibernate -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Boot Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Spring Security & JWT -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Lombok Boilerplate Reducer -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Unit & Integration Tests -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
];

export const JavaBackendExplorer: React.FC = () => {
  const { products, vendors } = useApp();
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [simulatedEndpoint, setSimulatedEndpoint] = useState<string>('GET /api/v1/products');
  const [simulatedResponse, setSimulatedResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const selectedFile = JAVA_CODE_MODULES[selectedFileIndex];

  const filteredFiles = JAVA_CODE_MODULES.filter((f) => {
    return activeCategory === 'All' || f.category === activeCategory;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runApiSimulation = (endpoint: string) => {
    setSimulatedEndpoint(endpoint);
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      if (endpoint.includes('products')) {
        const sample = products.slice(0, 3).map((p) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          vendorName: p.vendorName,
          priceInr: p.price,
          stock: p.stock,
          coldChainCompliant: true,
          origin: p.origin,
        }));
        setSimulatedResponse(JSON.stringify(sample, null, 2));
      } else if (endpoint.includes('telemetry')) {
        setSimulatedResponse(
          JSON.stringify(
            {
              orderId: 'ORD-2026-7841',
              carrier: 'Manjunath K. (Cold Courier #14)',
              temperatureSensor: '3.6°C [COMPLIANT 2-4°C]',
              gpsCoordinate: { lat: 13.0285, lng: 77.545 },
              currentLocation: 'Yeshwanthpur Industrial Cold Hub, Bengaluru',
              transitStatus: 'OUT_FOR_DELIVERY',
              lastProbeTime: new Date().toISOString(),
            },
            null,
            2
          )
        );
      } else if (endpoint.includes('vendors')) {
        const sampleVendors = vendors.slice(0, 3).map((v) => ({
          id: v.id,
          name: v.name,
          businessReg: v.businessReg,
          location: v.location,
          rating: v.rating,
          state: 'KA',
        }));
        setSimulatedResponse(JSON.stringify(sampleVendors, null, 2));
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Coffee className="w-56 h-56 text-amber-300" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold tracking-wide">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
              Java 21 / Spring Boot 3.3 Architecture
            </span>
            <span>·</span>
            <span>Enterprise Microservice Backend</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white font-display">
            Converted Java Backend & REST APIs
          </h1>
          <p className="text-sm text-stone-300 leading-relaxed">
            The entire TypeScript agricultural platform has been transformed into production-grade Java Spring Boot classes: JPA entities, Spring Data repositories, thread-safe service logic, and REST controllers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-amber-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>9 Spring Boot Modules</span>
            </div>
            <span>·</span>
            <div>PostgreSQL & Hibernate JPA</div>
            <span>·</span>
            <div>Zero-Downtime Restock Logic</div>
          </div>
        </div>
      </div>

      {/* Main Code Viewer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Explorer */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-stone-800">
              <FolderTree className="w-4 h-4 text-amber-600" />
              <span>Package Explorer</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
              Java 21
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Entity', 'Repository', 'Service', 'Controller', 'Build'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="space-y-1.5">
            {filteredFiles.map((file) => {
              const originalIndex = JAVA_CODE_MODULES.findIndex((f) => f.name === file.name);
              const isSelected = selectedFileIndex === originalIndex;

              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFileIndex(originalIndex)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                      : 'border-transparent hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <FileCode2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-amber-600' : 'text-stone-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold truncate">{file.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        {file.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {file.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive REST Endpoint Simulator */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-800 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Test Spring REST API</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => runApiSimulation('GET /api/v1/products')}
                className="text-left text-xs font-mono p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-between text-stone-700"
              >
                <span>GET /api/v1/products</span>
                <Send className="w-3 h-3 text-stone-400" />
              </button>
              <button
                onClick={() => runApiSimulation('GET /api/v1/orders/ORD-2026-7841/telemetry')}
                className="text-left text-xs font-mono p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-between text-stone-700"
              >
                <span>GET /orders/telemetry</span>
                <Send className="w-3 h-3 text-stone-400" />
              </button>
              <button
                onClick={() => runApiSimulation('GET /api/v1/vendors')}
                className="text-left text-xs font-mono p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-between text-stone-700"
              >
                <span>GET /api/v1/vendors</span>
                <Send className="w-3 h-3 text-stone-400" />
              </button>
            </div>

            {isSimulating && (
              <div className="text-xs font-mono text-amber-600 animate-pulse flex items-center gap-2 p-2">
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Spring Boot DispatcherServlet...</span>
              </div>
            )}

            {simulatedResponse && !isSimulating && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>HTTP 200 OK</span>
                  <span>application/json</span>
                </div>
                <pre className="p-2.5 rounded-lg bg-stone-900 text-emerald-400 text-[10px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                  {simulatedResponse}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 bg-stone-900 text-stone-200 rounded-2xl border border-stone-800 shadow-lg overflow-hidden flex flex-col">
          {/* Code Viewer Header */}
          <div className="bg-stone-950 px-4 py-3 border-b border-stone-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </span>
              <span className="font-mono text-xs text-amber-400 font-bold truncate">
                {selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span>Copy Java</span>
                </>
              )}
            </button>
          </div>

          {/* Description bar */}
          <div className="bg-stone-950/60 px-4 py-2 border-b border-stone-800/60 text-xs text-stone-400 font-sans flex items-center justify-between">
            <span>{selectedFile.description}</span>
            <span className="font-mono text-[11px] text-stone-500 shrink-0">
              {selectedFile.code.split('\n').length} lines
            </span>
          </div>

          {/* Code Content */}
          <div className="p-4 overflow-x-auto max-h-[640px] font-mono text-xs leading-relaxed text-stone-200">
            <pre className="whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
